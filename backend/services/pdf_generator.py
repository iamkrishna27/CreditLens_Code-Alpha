from fpdf import FPDF
from models.customer import Customer
from models.prediction import Prediction

class PDFReport(FPDF):
    def header(self):
        # Arial bold 15
        self.set_font('helvetica', 'B', 15)
        # Move to the right
        self.cell(80)
        # Title
        self.cell(30, 10, 'Official Credit Risk Assessment Report', border=0, align='C')
        # Line break
        self.ln(20)

    def footer(self):
        # Position at 1.5 cm from bottom
        self.set_y(-15)
        # Arial italic 8
        self.set_font('helvetica', 'I', 8)
        # Page number
        self.cell(0, 10, f'Page {self.page_no()}/{{nb}}', align='C')

def generate_credit_report(customer: Customer, prediction: Prediction) -> bytes:
    pdf = PDFReport()
    pdf.add_page()
    pdf.set_font('helvetica', '', 12)
    
    # Customer Profile
    pdf.set_font('helvetica', 'B', 14)
    pdf.cell(0, 10, 'Customer Profile', ln=True)
    pdf.set_font('helvetica', '', 12)
    pdf.cell(0, 10, f'Name: {customer.name}', ln=True)
    pdf.cell(0, 10, f'Age: {customer.age}', ln=True)
    pdf.cell(0, 10, f'Annual Income: ${customer.income:,.2f}', ln=True)
    pdf.cell(0, 10, f'Existing Debt: ${customer.debt:,.2f}', ln=True)
    pdf.cell(0, 10, f'Requested Loan Amount: ${customer.loan_amount:,.2f}', ln=True)
    pdf.cell(0, 10, f'Employment Status: {customer.employment_status}', ln=True)
    pdf.ln(5)
    
    # Assessment Results
    pdf.set_font('helvetica', 'B', 14)
    pdf.cell(0, 10, 'Assessment Results', ln=True)
    pdf.set_font('helvetica', '', 12)
    pdf.cell(0, 10, f'Credit Score: {prediction.credit_score}', ln=True)
    # Handle Enum safely (prediction.risk_level.value if it's an enum, or just risk_level)
    risk_level_str = prediction.risk_level.value if hasattr(prediction.risk_level, 'value') else str(prediction.risk_level)
    pdf.cell(0, 10, f'Risk Level: {risk_level_str}', ln=True)
    pdf.cell(0, 10, f'Confidence Score: {prediction.confidence_score*100:.2f}%', ln=True)
    pdf.ln(5)
    
    # XAI Breakdown
    xai = prediction.xai_summary or {}
    pdf.set_font('helvetica', 'B', 14)
    pdf.cell(0, 10, 'Explainable AI (XAI) Breakdown', ln=True)
    pdf.set_font('helvetica', '', 12)
    
    pdf.cell(0, 10, 'Top Positive Factors (Improving Score):', ln=True)
    for pos in xai.get("top_positive_factors", []):
        pdf.cell(0, 10, f'  + {pos["feature"]}: {pos["contribution"]:.4f}', ln=True)
        
    pdf.cell(0, 10, 'Top Negative Factors (Reducing Score):', ln=True)
    for neg in xai.get("top_negative_factors", []):
        pdf.cell(0, 10, f'  - {neg["feature"]}: {neg["contribution"]:.4f}', ln=True)
    pdf.ln(5)
    
    # Recommendations
    pdf.set_font('helvetica', 'B', 14)
    pdf.cell(0, 10, 'Actionable Recommendations', ln=True)
    pdf.set_font('helvetica', '', 12)
    for rec in xai.get("recommendations", []):
        # Use multi_cell for wrapping text
        pdf.set_x(10)
        pdf.multi_cell(w=0, h=8, text=f"* {rec}")
        pdf.ln(2)
        
    # Return as bytes
    return bytes(pdf.output())
