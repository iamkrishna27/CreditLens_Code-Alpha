import React from 'react';
import { CheckCircle, AlertTriangle, TrendingUp, Info, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function ResultsView({ data }) {
  const { prediction, xai_summary, prediction_id } = data;
  
  const getRiskColor = (level) => {
    switch(level) {
      case 'Excellent': return 'text-emerald-400';
      case 'Good': return 'text-green-400';
      case 'Average': return 'text-yellow-400';
      case 'Risky': return 'text-orange-400';
      case 'Very Risky': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getScoreColorClass = (score) => {
    if (score >= 800) return 'text-emerald-400';
    if (score >= 600) return 'text-green-400';
    if (score >= 400) return 'text-yellow-400';
    if (score >= 200) return 'text-orange-400';
    return 'text-red-500';
  };

  const chartData = [
    ...(xai_summary.top_positive_factors || []).map(f => ({ name: f.feature, value: f.contribution, type: 'positive' })),
    ...(xai_summary.top_negative_factors || []).map(f => ({ name: f.feature, value: f.contribution, type: 'negative' }))
  ].sort((a, b) => b.value - a.value);

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold text-white tracking-tight">Assessment Results</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-slate-800 px-3 py-1.5 rounded-full text-sm">
            <Info className="w-4 h-4 text-slate-400" />
            <span className="text-slate-300">Confidence: {(prediction.confidence_score * 100).toFixed(1)}%</span>
          </div>
          {prediction_id && (
            <button
              onClick={() => window.open(`http://localhost:8000/api/predictions/${prediction_id}/pdf`, '_blank')}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 shadow-md hover:shadow-indigo-500/25 border border-indigo-500/30"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Report</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Score Display */}
      <div className="flex flex-col items-center justify-center p-8 bg-slate-800/50 rounded-2xl border border-slate-700/50 mb-8">
        <div className={`text-7xl font-black tracking-tighter ${getScoreColorClass(prediction.credit_score)}`}>
          {prediction.credit_score}
        </div>
        <div className="mt-4 text-xl font-medium text-slate-300 flex items-center">
          Risk Category: <span className={`ml-2 font-bold ${getRiskColor(prediction.risk_level)}`}>{prediction.risk_level}</span>
        </div>
      </div>

      {/* SHAP Insights */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
          Explainable AI Insights
        </h3>
        
        <div className="h-64 w-full bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} width={120} />
              <Tooltip 
                cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                formatter={(value) => value.toFixed(4)}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.value > 0 ? '#10b981' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-slate-500 mt-2 text-center">SHAP value breakdown of contributing features</p>
      </div>

      {/* Recommendations */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
          Actionable Recommendations
        </h3>
        <ul className="space-y-3">
          {(xai_summary.recommendations || []).map((rec, i) => (
            <li key={i} className="flex items-start bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 shadow-sm">
              <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-slate-300 leading-relaxed">{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
