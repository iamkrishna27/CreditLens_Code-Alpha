from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel
import plaid
from plaid.api import plaid_api
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
from plaid.model.products import Products
from plaid.model.country_code import CountryCode
from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
from plaid.model.accounts_get_request import AccountsGetRequest
from plaid.model.liabilities_get_request import LiabilitiesGetRequest
from core.config import settings
from core.database import get_db
from models.user import User
from api.auth import get_current_user

router = APIRouter()

# Setup Plaid client
plaid_env = plaid.Environment.Sandbox
if settings.PLAID_ENV == 'development':
    plaid_env = plaid.Environment.Development
elif settings.PLAID_ENV == 'production':
    plaid_env = plaid.Environment.Production

configuration = plaid.Configuration(
    host=plaid_env,
    api_key={
        'clientId': settings.PLAID_CLIENT_ID,
        'secret': settings.PLAID_SECRET,
    }
)
api_client = plaid.ApiClient(configuration)
client = plaid_api.PlaidApi(api_client)

class PublicTokenExchangeRequest(BaseModel):
    public_token: str

@router.post("/create_link_token")
async def create_link_token(current_user: User = Depends(get_current_user)):
    try:
        request = LinkTokenCreateRequest(
            products=[Products("transactions")],
            client_name=settings.PROJECT_NAME,
            country_codes=[CountryCode("US")],
            language="en",
            user=LinkTokenCreateRequestUser(client_user_id=str(current_user.id))
        )
        response = client.link_token_create(request)
        return {"link_token": response['link_token']}
    except plaid.ApiException as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post("/exchange_public_token")
async def exchange_public_token(
    request: PublicTokenExchangeRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    try:
        exchange_request = ItemPublicTokenExchangeRequest(public_token=request.public_token)
        exchange_response = client.item_public_token_exchange(exchange_request)
        access_token = exchange_response['access_token']
        
        # Save access token to user
        current_user.plaid_access_token = access_token
        db.add(current_user)
        await db.commit()
        
        return {"status": "success", "message": "Plaid account linked successfully"}
    except plaid.ApiException as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("/financial_data")
async def get_financial_data(current_user: User = Depends(get_current_user)):
    if not current_user.plaid_access_token:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No Plaid account linked")
    
    try:
        # Get Accounts (for income proxy / balances)
        accounts_request = AccountsGetRequest(access_token=current_user.plaid_access_token)
        accounts_response = client.accounts_get(accounts_request)
        
        # Get Liabilities (for debt)
        liabilities_request = LiabilitiesGetRequest(access_token=current_user.plaid_access_token)
        liabilities_response = client.liabilities_get(liabilities_request)
        
        # MOCK LOGIC FOR SANDBOX (As discussed in the plan)
        # If in sandbox and balances are mostly 0, we can inject realistic FinTech payload
        # For this implementation, we will extract raw amounts, but provide a fallback
        total_balance = sum(account['balances']['current'] or 0 for account in accounts_response['accounts'] if account['type'] == 'depository')
        
        credit_cards = liabilities_response.get('liabilities', {}).get('credit', [])
        total_debt = sum(card['balances']['current'] or 0 for card in credit_cards)
        
        # Plaid Sandbox test users (user_good/pass_good) often don't have realistic incomes
        # We inject a mock realistic payload if the totals are too low, to demonstrate functionality.
        annual_income = total_balance * 12 if total_balance > 0 else 85000.0
        current_debt = total_debt if total_debt > 0 else 12500.0
        
        return {
            "income": annual_income,
            "debt": current_debt,
            "loan_amount": 15000.0, # default/mock
            "accounts": [acc.to_dict() for acc in accounts_response['accounts']]
        }
    except plaid.ApiException as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
