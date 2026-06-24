import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const HeroScoreCard = ({ score, riskLevel, confidence }) => {
  const [displayScore, setDisplayScore] = useState(200);

  useEffect(() => {
    let current = 200;
    const increment = Math.ceil((score - 200) / 40);
    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(current);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [score]);

  const minScore = 200;
  const maxScore = 1000;
  const normalizedScore = Math.max(0, Math.min(100, ((score - minScore) / (maxScore - minScore)) * 100));
  
  const getScoreColor = (s) => {
    if (s >= 800) return '#10b981'; 
    if (s >= 700) return '#22c55e'; 
    if (s >= 600) return '#eab308'; 
    if (s >= 500) return '#f97316'; 
    return '#ef4444'; 
  };

  const getRiskBadgeInfo = (s) => {
    if (s >= 700) return { text: 'Excellent', icon: '🟢', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (s >= 600) return { text: 'Average', icon: '🟡', color: 'text-yellow-700 bg-yellow-50 border-yellow-200' };
    return { text: 'Risky', icon: '🔴', color: 'text-red-700 bg-red-50 border-red-200' };
  };

  const color = getScoreColor(score);
  const badgeInfo = getRiskBadgeInfo(score);
  
  const data = [
    { name: 'Score', value: normalizedScore },
    { name: 'Remaining', value: 100 - normalizedScore }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] border border-slate-100 p-6 flex flex-col items-center justify-center relative overflow-hidden h-full w-full">
      <div className="w-full text-left mb-2">
        <h3 className="text-lg font-bold text-slate-800">Credit Score</h3>
        <p className="text-xs text-slate-500">AI-driven risk assessment</p>
      </div>

      <div className="relative w-full max-w-sm h-48 mt-4 flex justify-center">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="70%"
              startAngle={180}
              endAngle={0}
              innerRadius={80}
              outerRadius={100}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
              isAnimationActive={true}
              animationDuration={1500}
              animationEasing="ease-out"
            >
              <Cell fill={color} />
              <Cell fill="#f1f5f9" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-10">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-6xl font-black tracking-tighter"
            style={{ color }}
          >
            {displayScore}
          </motion.div>
          <div className={`mt-2 px-3 py-1 rounded-full border text-xs font-bold flex items-center gap-1.5 shadow-sm ${badgeInfo.color}`}>
            <span>{badgeInfo.icon}</span> {badgeInfo.text}
          </div>
        </div>
      </div>

      <div className="w-full mt-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
        <div className="flex justify-between text-xs font-semibold text-slate-600 mb-2">
          <span>Model Confidence</span>
          <span>{(confidence * 100).toFixed(1)}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${confidence * 100}%` }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="bg-primary h-2 rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroScoreCard;
