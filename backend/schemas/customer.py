from pydantic import BaseModel, ConfigDict
import uuid
from datetime import datetime

class CustomerBase(BaseModel):
    name: str
    age: int
    income: float
    debt: float
    loan_amount: float
    employment_status: str
    credit_history_length_months: int
    previous_defaults: int

class CustomerCreate(CustomerBase):
    pass

class CustomerRead(CustomerBase):
    id: uuid.UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
