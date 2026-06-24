import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, DollarSign, CreditCard, Briefcase, Activity, CheckCircle, ChevronDown } from 'lucide-react';
import BankConnect from './BankConnect';

const AssessmentForm = ({ onSubmit, isLoading }) => {
  const [isWhatIf, setIsWhatIf] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: 30,
    income: 60000,
    debt: 15000,
    loan_amount: 25000,
    employment_status: 'Employed',
    credit_history_length_months: 48,
    previous_defaults: 0,
  });

  const handlePlaidData = (data) => {
    setFormData((prev) => ({
      ...prev,
      income: data.income,
      debt: data.debt,
    }));
    setIsVerified(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (isVerified && (name === 'income' || name === 'debt')) return;
    
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'name' || name === 'employment_status' ? value : Number(value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <div className="w-full bg-white rounded-[16px] shadow-sm border border-slate-200 p-5 lg:p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Customer Profile</h2>
          <p className="text-xs text-slate-500 mt-1">Provide financial details to run the assessment.</p>
        </div>
        
        {/* Compact Toggle Switch */}
        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200 shadow-inner">
          <span className={`text-[10px] font-bold uppercase tracking-wider ${!isWhatIf ? 'text-primary' : 'text-slate-400'}`}>Standard</span>
          <button
            type="button"
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
              isWhatIf ? 'bg-primary' : 'bg-slate-300'
            }`}
            onClick={() => setIsWhatIf(!isWhatIf)}
          >
            <span className="sr-only">Toggle What-If Simulator</span>
            <span
              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow-sm ${
                isWhatIf ? 'translate-x-4' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${isWhatIf ? 'text-primary' : 'text-slate-400'}`}>What-If</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          
          <BankConnect onDataReceived={handlePlaidData} />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-primary focus:border-primary bg-slate-50 transition-colors hover:bg-slate-100/50"
                  placeholder="Jane Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Age</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required min="18"
                  className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-primary focus:border-primary bg-slate-50 transition-colors hover:bg-slate-100/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Credit History (Mo)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="number"
                  name="credit_history_length_months"
                  value={formData.credit_history_length_months}
                  onChange={handleChange}
                  required min="0"
                  className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-primary focus:border-primary bg-slate-50 transition-colors hover:bg-slate-100/50"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Employment</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase className="h-4 w-4 text-slate-400" />
                  </div>
                  <select
                    name="employment_status"
                    value={formData.employment_status}
                    onChange={handleChange}
                    className="block w-full pl-9 pr-8 py-2 text-sm border border-slate-200 rounded-xl focus:ring-primary focus:border-primary bg-slate-50 appearance-none"
                  >
                    <option value="Employed">Employed</option>
                    <option value="Self-Employed">Self-Employed</option>
                    <option value="Unemployed">Unemployed</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                     <ChevronDown className="h-4 w-4 text-slate-400" />
                  </div>
                </div>
             </div>
             
             <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Prev Defaults</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CheckCircle className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="number"
                  name="previous_defaults"
                  value={formData.previous_defaults}
                  onChange={handleChange}
                  required min="0"
                  className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-primary focus:border-primary bg-slate-50 transition-colors hover:bg-slate-100/50"
                />
              </div>
            </div>
          </div>

          <div className={`space-y-4 p-4 rounded-xl border transition-colors duration-300 ${isWhatIf ? 'bg-primary/5 border-primary/20' : 'bg-slate-50 border-slate-100'}`}>
            <DynamicField
              isWhatIf={isWhatIf}
              isVerified={isVerified}
              icon={<Briefcase className="h-4 w-4 text-slate-400" />}
              label="Annual Income"
              name="income"
              value={formData.income}
              onChange={handleChange}
              min={10000} max={500000} step={1000} prefix="$"
            />
            <DynamicField
              isWhatIf={isWhatIf}
              isVerified={isVerified}
              icon={<CreditCard className="h-4 w-4 text-slate-400" />}
              label="Current Debt"
              name="debt"
              value={formData.debt}
              onChange={handleChange}
              min={0} max={200000} step={500} prefix="$"
            />
            <DynamicField
              isWhatIf={isWhatIf}
              icon={<DollarSign className="h-4 w-4 text-slate-400" />}
              label="Loan Amount"
              name="loan_amount"
              value={formData.loan_amount}
              onChange={handleChange}
              min={1000} max={1000000} step={1000} prefix="$"
            />
          </div>

        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={isLoading}
          className={`w-full mt-6 flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all ${
            isLoading ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 animate-spin" />
              <span>Analyzing Risk...</span>
            </div>
          ) : (
            'Generate Assessment'
          )}
        </motion.button>
      </form>
    </div>
  );
};

const DynamicField = ({ isWhatIf, isVerified, icon, label, name, value, onChange, min, max, step, prefix }) => {
  const isLocked = isVerified && (name === 'income' || name === 'debt');
  
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <div className="flex items-center gap-2">
          <label className="block text-xs font-semibold text-slate-700">{label}</label>
          {isLocked && (
            <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded shadow-sm">
              <CheckCircle className="w-3 h-3" /> Verified
            </span>
          )}
        </div>
        {(isWhatIf && !isLocked) && (
          <span className="text-[11px] font-bold text-primary bg-white border border-primary/20 px-2 py-0.5 rounded-md shadow-sm">
            {prefix}{Number(value).toLocaleString()}
          </span>
        )}
      </div>
      
      {(isWhatIf && !isLocked) ? (
        <div className="relative pt-1 pb-1">
          <input
            type="range"
            name={name}
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary hover:accent-blue-700 transition-all"
          />
        </div>
      ) : (
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
          <input
            type="number"
            name={name}
            value={value}
            onChange={onChange}
            required
            readOnly={isLocked}
            className={`block w-full pl-9 pr-3 py-2 text-sm border rounded-xl focus:ring-primary focus:border-primary transition-colors shadow-sm ${
              isLocked 
                ? 'bg-slate-100 border-slate-300 text-slate-500 cursor-not-allowed select-none' 
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          />
        </div>
      )}
    </div>
  );
};

export default AssessmentForm;
