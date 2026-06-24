import os
import numpy as np
import pandas as pd
import joblib
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.ensemble import RandomForestClassifier

def generate_synthetic_data(n_samples=5000):
    """
    1. Data Generation
    Generate a synthetic but highly realistic dataset of financial records.
    """
    np.random.seed(42)
    
    age = np.random.randint(18, 70, n_samples)
    income = np.random.normal(60000, 25000, n_samples).clip(15000, 200000)
    debt = np.random.normal(20000, 15000, n_samples).clip(0, 150000)
    loan_amount = np.random.normal(15000, 10000, n_samples).clip(1000, 100000)
    employment_status = np.random.choice(['Employed', 'Unemployed', 'Self-Employed'], n_samples, p=[0.7, 0.1, 0.2])
    credit_history_length_months = np.random.randint(0, 240, n_samples)
    previous_defaults = np.random.poisson(0.5, n_samples).clip(0, 5)
    
    df = pd.DataFrame({
        'age': age,
        'income': income,
        'debt': debt,
        'loan_amount': loan_amount,
        'employment_status': employment_status,
        'credit_history_length_months': credit_history_length_months,
        'previous_defaults': previous_defaults
    })
    
    # 2. Feature Engineering
    # Calculate practical financial metrics
    df['debt_to_income_ratio'] = df['debt'] / df['income']
    df['loan_to_income_ratio'] = df['loan_amount'] / df['income']
    
    # 3. Target Variable Definition
    # We compute a hidden 'risk_score' rule-based metric to realistically assign the categorical risk_level.
    # Higher score = higher risk.
    risk_score = (
        df['previous_defaults'] * 2.0 +
        df['debt_to_income_ratio'] * 3.0 +
        df['loan_to_income_ratio'] * 2.0 -
        (df['credit_history_length_months'] / 120.0) - 
        (df['age'] / 50.0)
    )
    
    # Add an employment status penalty
    emp_penalty = df['employment_status'].map({'Employed': 0.0, 'Self-Employed': 0.5, 'Unemployed': 2.0})
    risk_score += emp_penalty
    
    # Discretize the continuous risk_score into target categories
    def map_risk_level(score):
        if score <= 1.0:
            return 'Excellent'
        elif score <= 2.5:
            return 'Good'
        elif score <= 4.0:
            return 'Average'
        elif score <= 6.0:
            return 'Risky'
        else:
            return 'Very Risky'
            
    df['risk_level'] = risk_score.apply(map_risk_level)
    
    return df

def train_pipeline(df):
    """
    4. Model Training
    Builds and trains a Scikit-Learn Pipeline.
    """
    X = df.drop(columns=['risk_level'])
    y = df['risk_level']
    
    # Define features
    categorical_features = ['employment_status']
    numerical_features = ['age', 'income', 'debt', 'loan_amount', 'credit_history_length_months', 
                          'previous_defaults', 'debt_to_income_ratio', 'loan_to_income_ratio']
    
    # Define preprocessing steps
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numerical_features),
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
        ])
        
    # Create the complete pipeline
    pipeline = Pipeline([
        ('preprocessor', preprocessor),
        ('classifier', RandomForestClassifier(n_estimators=100, random_state=42, class_weight='balanced'))
    ])
    
    # Train the pipeline
    pipeline.fit(X, y)
    
    return pipeline, pipeline.classes_

def calculate_credit_score(probabilities, classes):
    """
    5. Credit Score Logic:
    Mathematically maps output probabilities from the RF model to a numerical credit_score (0-1000).
    
    Explanation of the Math:
    Instead of simply taking the argmax (the most likely class), we calculate the Expected Value 
    of the credit score. We assign a baseline numerical weight (score) to each risk category:
    - Excellent: 1000
    - Good: 800
    - Average: 600
    - Risky: 400
    - Very Risky: 200
    
    If the model predicts: [Excellent: 0.1, Good: 0.8, Average: 0.1, Risky: 0.0, Very Risky: 0.0]
    The Score = (0.1 * 1000) + (0.8 * 800) + (0.1 * 600) + (0 * 400) + (0 * 200) = 800.
    This provides a continuous, highly granular credit score between 200 and 1000 based on exact confidence.
    """
    weights_map = {
        'Excellent': 1000,
        'Good': 800,
        'Average': 600,
        'Risky': 400,
        'Very Risky': 200
    }
    
    # Create a weight array in the exact same order as the model's classes_
    weights = np.array([weights_map[c] for c in classes])
    
    # Calculate expected value via dot product
    expected_scores = np.dot(probabilities, weights)
    
    return expected_scores

if __name__ == "__main__":
    print("Initializing Data Generation...")
    df = generate_synthetic_data(5000)
    print(f"Synthetic dataset generated: {df.shape[0]} rows, {df.shape[1]} columns.")
    
    print("\nTraining Random Forest Pipeline...")
    model_pipeline, model_classes = train_pipeline(df)
    print("Model training complete.")
    
    # Demonstration of the Credit Score Logic
    sample_data = df.drop(columns=['risk_level']).head(5)
    sample_probs = model_pipeline.predict_proba(sample_data)
    sample_scores = calculate_credit_score(sample_probs, model_classes)
    
    print("\n--- Validation Sample ---")
    for i in range(5):
        print(f"Record {i+1} | Assigned Label: '{df.iloc[i]['risk_level']}' | Computed Credit Score: {sample_scores[i]:.2f}/1000")
    
    # 6. Artifact Export
    # Save the pipeline dynamically to backend/ml_artifacts/
    current_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(current_dir)
    
    artifacts_dir = os.path.join(project_root, 'backend', 'ml_artifacts')
    os.makedirs(artifacts_dir, exist_ok=True)
    
    model_path = os.path.join(artifacts_dir, 'credit_model.pkl')
    joblib.dump(model_pipeline, model_path)
    print(f"\n[Success] Model pipeline exported safely to: {model_path}")
