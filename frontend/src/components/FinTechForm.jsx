import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, DollarSign, CreditCard, Briefcase, Activity } from 'lucide-react';

const FinTechForm = ({ onSubmit, isLoading }) => {
  const [isWhatIf, setIsWhatIf] = useState(false);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
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
    <div className="w-full max-w-2xl mx-auto p-8 bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Credit Assessment</h2>
          <p className="text-sm text-gray-500 mt-1">Enter details to generate your risk profile</p>
        </div>
        
        {/* Toggle Switch */}
        <div className="flex items-center gap-3 bg-gray-50/80 p-2 rounded-xl border border-gray-100 shadow-inner">
          <span className={`text-sm font-medium ${!isWhatIf ? 'text-blue-600' : 'text-gray-400'}`}>Standard</span>
          <button
            type="button"
            className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isWhatIf ? 'bg-blue-600' : 'bg-gray-300'
            }`}
            onClick={() => setIsWhatIf(!isWhatIf)}
          >
            <span className="sr-only">Toggle What-If Simulator</span>
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${
                isWhatIf ? 'translate-x-8' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${isWhatIf ? 'text-blue-600' : 'text-gray-400'}`}>What-If</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50/50 transition-colors hover:bg-gray-50"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                min="18"
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50/50 transition-colors hover:bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Credit History (Months)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                name="credit_history_length_months"
                value={formData.credit_history_length_months}
                onChange={handleChange}
                required
                min="0"
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50/50 transition-colors hover:bg-gray-50"
              />
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 space-y-6 bg-gray-50/40 p-6 rounded-2xl border border-gray-100">
            <DynamicField
              isWhatIf={isWhatIf}
              icon={<Briefcase className="h-5 w-5 text-gray-400" />}
              label="Annual Income"
              name="income"
              value={formData.income}
              onChange={handleChange}
              min={10000}
              max={500000}
              step={1000}
              prefix="$"
            />
            <DynamicField
              isWhatIf={isWhatIf}
              icon={<CreditCard className="h-5 w-5 text-gray-400" />}
              label="Current Debt"
              name="debt"
              value={formData.debt}
              onChange={handleChange}
              min={0}
              max={200000}
              step={500}
              prefix="$"
            />
            <DynamicField
              isWhatIf={isWhatIf}
              icon={<DollarSign className="h-5 w-5 text-gray-400" />}
              label="Requested Loan Amount"
              name="loan_amount"
              value={formData.loan_amount}
              onChange={handleChange}
              min={1000}
              max={1000000}
              step={1000}
              prefix="$"
            />
          </div>

        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${
            isLoading ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 animate-spin" />
              <span>Analyzing...</span>
            </div>
          ) : (
            'Generate Assessment'
          )}
        </motion.button>
      </form>
    </div>
  );
};

const DynamicField = ({ isWhatIf, icon, label, name, value, onChange, min, max, step, prefix }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {isWhatIf && (
          <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            {prefix}{Number(value).toLocaleString()}
          </span>
        )}
      </div>
      
      {isWhatIf ? (
        <div className="relative pt-2 pb-2">
          <input
            type="range"
            name={name}
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 transition-all"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
            <span>{prefix}{min.toLocaleString()}</span>
            <span>{prefix}{max.toLocaleString()}</span>
          </div>
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
            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white transition-colors hover:bg-gray-50 shadow-sm"
          />
        </div>
      )}
    </div>
  );
};

export default FinTechForm;
