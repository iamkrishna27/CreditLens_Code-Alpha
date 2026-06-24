import React from 'react';
import { Download, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const ReportActions = ({ predictionId }) => {
  const handleDownloadPDF = () => {
    window.open(`http://localhost:8000/api/predictions/${predictionId}/pdf`, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] border border-slate-100 p-6 h-full w-full flex flex-col justify-center items-center text-center">
      <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3">
        <FileText className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">Official Documentation</h3>
      <p className="text-xs text-slate-500 mb-5 max-w-[200px]">Generate a certified PDF report for external verification.</p>
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleDownloadPDF}
        className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold shadow-md flex items-center justify-center gap-2 transition-colors"
      >
        <Download className="w-4 h-4" />
        Download Assessment Report
      </motion.button>
    </div>
  );
};

export default ReportActions;
