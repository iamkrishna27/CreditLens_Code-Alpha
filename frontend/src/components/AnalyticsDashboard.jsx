import React from 'react';
import { motion } from 'framer-motion';
import HeroScoreCard from './HeroScoreCard';
import FinancialSummary from './FinancialSummary';
import ShapChart from './ShapChart';
import Recommendations from './Recommendations';
import ReportActions from './ReportActions';

const AnalyticsDashboard = ({ prediction, customerData }) => {
  if (!prediction) return null;

  const { credit_score, risk_level, confidence_score, xai_summary, id } = prediction;
  
  // Default values in case customerData is not passed
  const income = customerData?.income || 0;
  const debt = customerData?.debt || 0;
  const loanAmount = customerData?.loan_amount || 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-full flex flex-col gap-6 max-w-6xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[250px]">
        <HeroScoreCard score={credit_score} riskLevel={risk_level} confidence={confidence_score} />
        <FinancialSummary income={income} debt={debt} loanAmount={loanAmount} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
        <div className="md:col-span-2 flex">
          <ShapChart xaiSummary={xai_summary} />
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex-1">
            <Recommendations xaiSummary={xai_summary} creditScore={credit_score} />
          </div>
          <div>
            <ReportActions predictionId={id} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsDashboard;
