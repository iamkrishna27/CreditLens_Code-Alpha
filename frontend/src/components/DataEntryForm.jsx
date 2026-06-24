import React, { useState } from 'react';

export default function DataEntryForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    name: 'John Doe',
    age: 35,
    income: 75000,
    debt: 20000,
    loan_amount: 15000,
    employment_status: 'Employed',
    credit_history_length_months: 60,
    previous_defaults: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const isNum = ['age', 'income', 'debt', 'loan_amount', 'credit_history_length_months', 'previous_defaults'].includes(name);
    setFormData(prev => ({
      ...prev,
      [name]: isNum ? Number(value) : value
    }));
  };

  const submit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClass = "w-full mt-1 bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";
  const labelClass = "block text-sm font-medium text-slate-600";

  return (
    <form onSubmit={submit} className="space-y-5 flex-1 flex flex-col justify-between">
      <div>
        <div className="grid grid-cols-2 gap-5 mb-5">
          <div>
            <label className={labelClass}>Full Name</label>
            <input required name="name" type="text" value={formData.name} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Age</label>
            <input required name="age" type="number" min="18" max="120" value={formData.age} onChange={handleChange} className={inputClass} />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-5 mb-5">
          <div>
            <label className={labelClass}>Annual Income ($)</label>
            <input required name="income" type="number" min="0" value={formData.income} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Existing Debt ($)</label>
            <input required name="debt" type="number" min="0" value={formData.debt} onChange={handleChange} className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5 mb-5">
          <div>
            <label className={labelClass}>Requested Loan Amount ($)</label>
            <input required name="loan_amount" type="number" min="0" value={formData.loan_amount} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Employment Status</label>
            <select name="employment_status" value={formData.employment_status} onChange={handleChange} className={inputClass}>
              <option value="Employed">Employed</option>
              <option value="Self-Employed">Self-Employed</option>
              <option value="Unemployed">Unemployed</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5 mb-5">
          <div>
            <label className={labelClass}>Credit History (Months)</label>
            <input required name="credit_history_length_months" type="number" min="0" value={formData.credit_history_length_months} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Previous Defaults</label>
            <input required name="previous_defaults" type="number" min="0" value={formData.previous_defaults} onChange={handleChange} className={inputClass} />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-blue-200 transition-all focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:opacity-70 flex justify-center items-center"
      >
        {loading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing Risk...
          </span>
        ) : (
          "Generate Credit Assessment"
        )}
      </button>
    </form>
  );
}
