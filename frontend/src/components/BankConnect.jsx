import React, { useState, useEffect, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { Shield, CheckCircle2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/axios';

const BankConnect = ({ onDataReceived }) => {
  const [linkToken, setLinkToken] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const generateToken = async () => {
      try {
        const response = await api.post('/plaid/create_link_token');
        setLinkToken(response.data.link_token);
      } catch (err) {
        console.error("Error creating Link token:", err);
      }
    };
    if (!isVerified) {
      generateToken();
    }
  }, [isVerified]);

  const onSuccess = useCallback(async (public_token, metadata) => {
    setLoading(true);
    setError(null);
    try {
      // Exchange public token
      await api.post('/plaid/exchange_public_token', { public_token });
      
      // Fetch financial data
      const dataResponse = await api.get('/plaid/financial_data');
      setIsVerified(true);
      onDataReceived(dataResponse.data);
    } catch (err) {
      console.error("Error exchanging token or fetching data:", err);
      setError("Failed to link bank account. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [onDataReceived]);

  const config = {
    token: linkToken,
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);

  if (isVerified) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full rounded-2xl bg-emerald-50 border border-emerald-200 p-4 flex items-center justify-between mb-6 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="bg-emerald-100 p-2 rounded-full text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-emerald-800 font-semibold text-sm">Bank Account Linked</h4>
            <p className="text-emerald-600 text-xs mt-0.5">Financial data verified by Plaid</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="mb-6">
      {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
      <button
        type="button"
        onClick={() => open()}
        disabled={!ready || loading}
        className="w-full relative overflow-hidden group bg-gradient-to-br from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white rounded-2xl p-4 flex items-center justify-center gap-3 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {/* Glassmorphic shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
        
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Shield className="w-5 h-5 text-emerald-400" />
        )}
        <span className="font-semibold text-sm">
          {loading ? "Verifying..." : "Securely Connect Bank"}
        </span>
      </button>
      <p className="text-center text-[10px] text-slate-400 mt-2 flex items-center justify-center gap-1">
        Powered by <span className="font-bold">Plaid</span>
      </p>
    </div>
  );
};

export default BankConnect;
