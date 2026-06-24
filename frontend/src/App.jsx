import React, { useState, useEffect } from 'react';
import api from './api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, BrainCircuit, BarChart } from 'lucide-react';
import DashboardLayout from './components/DashboardLayout';
import AssessmentForm from './components/AssessmentForm';
import HeroScoreCard from './components/HeroScoreCard';
import FinancialSummary from './components/FinancialSummary';
import ShapChart from './components/ShapChart';
import Recommendations from './components/Recommendations';
import ReportActions from './components/ReportActions';
import AuthModal from './components/AuthModal';
import { useAuth } from './context/AuthContext';

const loadingMessages = [
  "Validating Input...",
  "Engineering Features...",
  "Running ML Model...",
  "Computing SHAP Values...",
  "Preparing Report..."
];

function App() {
  const { user } = useAuth();
  const [result, setResult] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 600);
    } else {
      setMessageIndex(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setCustomerData(formData);
    
    try {
      const response = await api.post('/predict', formData);
      console.log("API Response:", response.data);
      
      // Artificial delay to allow the "deep AI analysis" staged animation to play out
      setTimeout(() => {
        const apiData = response.data;
        
        // Normalize the xai_summary structure if it uses the nested arrays from the backend
        let normalizedXai = apiData.xai_summary;
        if (apiData.xai_summary && Array.isArray(apiData.xai_summary.top_positive_factors)) {
          normalizedXai = {};
          apiData.xai_summary.top_positive_factors.forEach(item => {
            normalizedXai[item.feature] = item.contribution;
          });
          apiData.xai_summary.top_negative_factors.forEach(item => {
            normalizedXai[item.feature] = item.contribution;
          });
        }

        // Extract the nested prediction object
        const processedResult = apiData.prediction ? {
          ...apiData.prediction,
          xai_summary: normalizedXai,
          id: apiData.prediction_id || apiData.id
        } : apiData;

        setResult(processedResult);
        setLoading(false);
      }, 3000); 
      
    } catch (err) {
      console.error("API Error:", err);
      setTimeout(() => {
        setError(err.response?.data?.detail || err.message);
        setLoading(false);
      }, 1000);
    }
  };

  const hasValidPrediction = result !== null && result !== undefined && result.credit_score !== undefined;

  return (
    <>
      <AnimatePresence mode="wait">
        {!user ? (
          <AuthModal key="auth-modal" />
        ) : (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full"
          >
            <DashboardLayout
              leftPane={
                <div className="flex flex-col h-full">
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-8 p-5 bg-red-50 border-l-4 border-red-500 text-red-800 rounded-r-2xl shadow-sm flex items-start gap-3"
                    >
                      <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-500" />
                      <span className="font-medium text-sm">{error}</span>
                    </motion.div>
                  )}
                  
                  <div className="h-full overflow-y-auto custom-scrollbar pb-10 pr-2">
                    <AssessmentForm onSubmit={handleSubmit} isLoading={loading} />
                  </div>
                </div>
              }
              rightPane={
                <div className="bg-white rounded-[2rem] shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-slate-100/60 overflow-hidden relative flex flex-col h-full min-h-[600px]">
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 backdrop-blur-md z-10 p-12 text-center"
                      >
                        <motion.div 
                          animate={{ 
                            scale: [1, 1.1, 1],
                            rotate: [0, 360],
                          }}
                          transition={{ 
                            duration: 4, 
                            repeat: Infinity,
                            ease: "linear" 
                          }}
                          className="mb-10 p-6 bg-primary/10 rounded-3xl text-primary shadow-inner border border-primary/20"
                        >
                          <BrainCircuit className="w-16 h-16" />
                        </motion.div>
                        
                        <div className="h-12 flex items-center justify-center overflow-hidden w-full">
                          <AnimatePresence mode="wait">
                            <motion.h3
                              key={messageIndex}
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              exit={{ y: -20, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="text-2xl font-bold text-slate-800 tracking-tight"
                            >
                              {loadingMessages[messageIndex]}
                            </motion.h3>
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    ) : hasValidPrediction ? (
                      <motion.div
                        key="results"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full w-full overflow-y-auto bg-background p-4 sm:p-8 pb-12 flex flex-col gap-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[250px]">
                          <HeroScoreCard 
                            score={result.credit_score} 
                            riskLevel={result.risk_level} 
                            confidence={result.confidence_score} 
                          />
                          <FinancialSummary 
                            income={customerData?.income || 0} 
                            debt={customerData?.debt || 0} 
                            loanAmount={customerData?.loan_amount || 0} 
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
                          <div className="md:col-span-2 flex">
                            <ShapChart xaiSummary={result.xai_summary} />
                          </div>
                          <div className="flex flex-col gap-6">
                            <div className="flex-1">
                              <Recommendations xaiSummary={result.xai_summary} creditScore={result.credit_score} />
                            </div>
                            <div>
                              <ReportActions predictionId={result.id} />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-full w-full flex flex-col items-center justify-center p-12 text-center bg-slate-50/50"
                      >
                        <div className="bg-white/80 backdrop-blur-md p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col items-center max-w-md">
                          <div className="w-20 h-20 mb-6 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm text-slate-400">
                            <BarChart className="w-10 h-10" />
                          </div>
                          <h3 className="text-xl font-bold text-slate-800 tracking-tight mb-3">Awaiting Data</h3>
                          <p className="text-slate-500 text-sm leading-relaxed">
                            Fill out the customer profile and run the assessment to view AI-driven insights.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
