import React from 'react';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

const Recommendations = ({ xaiSummary, creditScore }) => {
  const shapData = Object.entries(xaiSummary || {}).map(([key, value]) => ({ name: key, value: Number(value) }));
  const negativeFactors = shapData.filter(d => d.value < 0).sort((a, b) => a.value - b.value);
  
  const recs = [];
  
  if (negativeFactors.length > 0) {
    recs.push({
      priority: 'High',
      text: `Address your ${negativeFactors[0].name.replace(/_/g, ' ')} to significantly improve your profile.`,
      icon: <AlertTriangle className="w-5 h-5 text-danger" />
    });
  }
  
  if (creditScore < 650) {
    recs.push({
      priority: 'High',
      text: "Focus on reducing your current debt obligations to lower your risk profile.",
      icon: <AlertTriangle className="w-5 h-5 text-danger" />
    });
  } else if (creditScore < 750) {
    recs.push({
      priority: 'Medium',
      text: "Maintain a clean payment history to eventually reach the Excellent tier.",
      icon: <Info className="w-5 h-5 text-warning" />
    });
  } else {
    recs.push({
      priority: 'Low',
      text: "Continue your current financial habits; your profile is very strong.",
      icon: <CheckCircle2 className="w-5 h-5 text-success" />
    });
  }

  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] border border-slate-100 p-6 h-full w-full">
      <h3 className="text-lg font-bold text-slate-800 mb-1">Recommendations</h3>
      <p className="text-xs text-slate-500 mb-4">Actionable advice based on AI findings</p>
      
      <div className="space-y-3">
        {recs.map((rec, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="mt-0.5 flex-shrink-0">{rec.icon}</div>
            <div>
              <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${
                rec.priority === 'High' ? 'text-danger' : 
                rec.priority === 'Medium' ? 'text-warning' : 'text-success'
              }`}>{rec.priority} Priority</div>
              <p className="text-sm font-medium text-slate-700 leading-tight">{rec.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
