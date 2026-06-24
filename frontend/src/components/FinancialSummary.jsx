import React from 'react';
import { DollarSign, CreditCard, Briefcase, Percent } from 'lucide-react';

const FinancialSummary = ({ income = 0, debt = 0, loanAmount = 0 }) => {
  const dti = income > 0 ? (debt / income) * 100 : 0;
  
  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] border border-slate-100 p-6 h-full w-full flex flex-col">
      <h3 className="text-lg font-bold text-slate-800 mb-1">Financial Summary</h3>
      <p className="text-xs text-slate-500 mb-6">Key metrics overview</p>
      
      <div className="grid grid-cols-2 gap-4 flex-1">
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Annual Income</span>
          </div>
          <div className="text-xl font-bold text-slate-800">${Number(income).toLocaleString()}</div>
        </div>
        
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-4 h-4 text-danger" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Existing Debt</span>
          </div>
          <div className="text-xl font-bold text-slate-800">${Number(debt).toLocaleString()}</div>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Requested Loan</span>
          </div>
          <div className="text-xl font-bold text-slate-800">${Number(loanAmount).toLocaleString()}</div>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 relative overflow-hidden flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2 relative z-10">
            <Percent className="w-4 h-4 text-warning" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">DTI Ratio</span>
          </div>
          <div className="text-xl font-bold text-slate-800 relative z-10">{dti.toFixed(1)}%</div>
          
          {/* Visual DTI Bar */}
          <div className="absolute bottom-0 left-0 w-full h-1.5 bg-slate-200">
             <div className={`h-full transition-all duration-1000 ${dti > 40 ? 'bg-danger' : dti > 30 ? 'bg-warning' : 'bg-success'}`} style={{ width: `${Math.min(100, dti)}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialSummary;
