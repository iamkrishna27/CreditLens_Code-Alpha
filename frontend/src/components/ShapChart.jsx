import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const ShapChart = ({ xaiSummary }) => {
  const shapData = Object.entries(xaiSummary || {})
    .map(([key, value]) => ({
      name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: Number(value)
    }))
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value));

  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] border border-slate-100 p-6 h-full w-full flex flex-col">
      <h3 className="text-lg font-bold text-slate-800 mb-1">Key Decision Factors</h3>
      <p className="text-xs text-slate-500 mb-6">SHAP value analysis of model inputs</p>
      
      <div className="flex-1 min-h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={shapData}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 60, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
            <XAxis type="number" stroke="#94a3b8" fontSize={11} />
            <YAxis 
              type="category" 
              dataKey="name" 
              tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }}
              width={100}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(0,0,0,0.02)' }}
              contentStyle={{ borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
              formatter={(value) => [value.toFixed(4), "Impact Score"]}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
              {shapData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.value > 0 ? '#22c55e' : '#ef4444'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ShapChart;
