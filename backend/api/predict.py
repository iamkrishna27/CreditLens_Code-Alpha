import os
import joblib
import pandas as pd
import numpy as np
import shap
from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import uuid
from typing import Any, Dict

from core.database import get_db
from services.pdf_generator import generate_credit_report
from schemas.customer import CustomerCreate
from models.customer import Customer
from models.prediction import Prediction, RiskLevel
from models.user import User
from models.audit_log import AuditLog
from api.auth import get_current_user

router = APIRouter()

# Dynamically load the model at startup
MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "ml_artifacts", "credit_model.pkl")
try:
    pipeline = joblib.load(MODEL_PATH)
except Exception as e:
    pipeline = None
    print(f"Warning: Failed to load ML model at startup: {e}")

def calculate_credit_score(probabilities, classes):
    """Maps output probabilities to a numerical credit_score (0-1000)."""
    weights_map = {
        'Excellent': 1000,
        'Good': 800,
        'Average': 600,
        'Risky': 400,
        'Very Risky': 200
    }
    weights = np.array([weights_map.get(c, 0) for c in classes])
    expected_scores = np.dot(probabilities, weights)
    return expected_scores[0]

@router.post("/predict", response_model=Dict[str, Any], tags=["Prediction"])
async def predict_credit_score(customer_in: CustomerCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    if pipeline is None:
        raise HTTPException(status_code=500, detail="Machine learning model is not loaded. Please train the model first.")
        
    # 1. Prepare data into Pandas DataFrame
    input_dict = customer_in.model_dump()
    df = pd.DataFrame([input_dict])
    
    # Feature Engineering (must match training exactly)
    # Avoid division by zero
    income_val = df['income'][0] if df['income'][0] > 0 else 1.0
    df['debt_to_income_ratio'] = df['debt'] / income_val
    df['loan_to_income_ratio'] = df['loan_amount'] / income_val
    
    # 2. Prediction Generation
    try:
        probs = pipeline.predict_proba(df)
        pred_class = pipeline.predict(df)[0]
        confidence_score = float(np.max(probs))
        credit_score = int(calculate_credit_score(probs, pipeline.classes_))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {e}")
        
    # 3. SHAP XAI - Credit Score Breakdown
    try:
        preprocessor = pipeline.named_steps['preprocessor']
        rf_model = pipeline.named_steps['classifier']
        
        # Transform the input data just like the pipeline does internally
        X_transformed = preprocessor.transform(df)
        if hasattr(X_transformed, "toarray"):
            X_transformed = X_transformed.toarray()
            
        # Extract feature names safely
        try:
            feature_names = preprocessor.get_feature_names_out()
        except AttributeError:
            num_features = ['age', 'income', 'debt', 'loan_amount', 'credit_history_length_months', 
                            'previous_defaults', 'debt_to_income_ratio', 'loan_to_income_ratio']
            cat_features = preprocessor.transformers_[1][1].get_feature_names_out(['employment_status'])
            feature_names = np.concatenate([num_features, cat_features])
            
        # Clean up feature names (remove preprocessor prefixes if any)
        feature_names = [f.split("__")[-1] for f in feature_names]
        
        explainer = shap.TreeExplainer(rf_model)
        shap_values = explainer.shap_values(X_transformed)
        
        # SHAP values structure varies between binary/multiclass and SHAP versions.
        # We find the index of the predicted class to explain THIS specific prediction.
        class_idx = list(pipeline.classes_).index(pred_class)
        
        if isinstance(shap_values, list):
            sv = shap_values[class_idx][0]
        else:
            if len(shap_values.shape) == 3:
                sv = shap_values[0, :, class_idx]
            else:
                sv = shap_values[0]
                
        feature_contributions = list(zip(feature_names, sv))
        
        # Top 3 positive factors (Pushing towards the prediction)
        feature_contributions.sort(key=lambda x: x[1], reverse=True)
        top_positive = [{"feature": f, "contribution": float(c)} for f, c in feature_contributions if c > 0][:3]
        
        # Top 3 negative factors (Pushing away from the prediction)
        feature_contributions.sort(key=lambda x: x[1], reverse=False)
        top_negative = [{"feature": f, "contribution": float(c)} for f, c in feature_contributions if c < 0][:3]
        
        # 4. Rule-based Recommendations
        recommendations = []
        for item in top_negative:
            feat = item['feature'].lower()
            if 'debt' in feat:
                recommendations.append("Consider reducing your existing debt to improve your score.")
            elif 'loan_amount' in feat:
                recommendations.append("A smaller loan amount would be viewed more favorably.")
            elif 'previous_defaults' in feat:
                recommendations.append("Focus on maintaining a clean payment record to offset past defaults.")
            elif 'income' in feat:
                recommendations.append("A higher verified income would lower your risk profile.")
            elif 'credit_history' in feat:
                recommendations.append("Keep your credit accounts active to build a longer credit history.")
            elif 'employment_status' in feat:
                recommendations.append("Stable full-time employment can significantly reduce risk.")
                
        if not recommendations:
            recommendations.append("Maintain your current healthy financial habits.")
            
        xai_summary = {
            "top_positive_factors": top_positive,
            "top_negative_factors": top_negative,
            "recommendations": list(set(recommendations))
        }
        
    except Exception as e:
        print(f"XAI processing failed: {e}")
        xai_summary = {"error": "XAI computation failed, explanations unavailable."}
        
    # 5. Database Save
    try:
        # Create Customer Record
        db_customer = Customer(**input_dict, user_id=current_user.id)
        db.add(db_customer)
        await db.flush() # Get the new ID without committing
        
        # Create Prediction Record
        # Ensure enum compatibility
        try:
            risk_level_enum = RiskLevel(pred_class)
        except ValueError:
            risk_level_enum = RiskLevel.Average
            
        db_prediction = Prediction(
            user_id=current_user.id,
            customer_id=db_customer.id,
            credit_score=credit_score,
            risk_level=risk_level_enum,
            confidence_score=confidence_score,
            xai_summary=xai_summary
        )
        db.add(db_prediction)
        
        db_audit_log = AuditLog(
            user_id=current_user.id,
            model_version="v1.0.0-RandomForest",
            input_features=input_dict,
            predicted_score=credit_score,
            risk_tier=pred_class
        )
        db.add(db_audit_log)
        
        await db.commit()
        await db.refresh(db_prediction)
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Database save failed: {e}")
        
    # 6. Return Payload
    return {
        "customer_id": str(db_customer.id),
        "prediction_id": str(db_prediction.id),
        "prediction": {
            "credit_score": credit_score,
            "risk_level": pred_class,
            "confidence_score": confidence_score
        },
        "xai_summary": xai_summary
    }

@router.get("/predictions/{prediction_id}/pdf", tags=["Prediction"])
async def get_prediction_pdf(prediction_id: str, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Generate and download a PDF report for a given prediction ID."""
    try:
        pred_uuid = uuid.UUID(prediction_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid prediction ID format.")
        
    result = await db.execute(select(Prediction).where(Prediction.id == pred_uuid))
    prediction = result.scalar_one_or_none()
    
    if not prediction or prediction.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Prediction not found.")
        
    # Get Customer
    result = await db.execute(select(Customer).where(Customer.id == prediction.customer_id))
    customer = result.scalar_one_or_none()
    
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found.")
        
    pdf_bytes = generate_credit_report(customer, prediction)
    
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=credit_report_{prediction.id}.pdf"}
    )
