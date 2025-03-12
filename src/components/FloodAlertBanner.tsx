
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface FloodAlertBannerProps {
  message: string;
  severity: 'low' | 'moderate' | 'high';
  onDismiss: () => void;
}

const FloodAlertBanner = ({ message, severity, onDismiss }: FloodAlertBannerProps) => {
  const bgColor = 
    severity === 'high' ? 'bg-red-100 border-red-400 text-red-700' :
    severity === 'moderate' ? 'bg-yellow-100 border-yellow-400 text-yellow-700' :
    'bg-blue-100 border-blue-400 text-blue-700';

  return (
    <div className={`px-4 py-3 rounded relative mb-4 border ${bgColor} flex items-center justify-between`}>
      <div className="flex items-center">
        <AlertTriangle className="h-5 w-5 mr-2" />
        <span>{message}</span>
      </div>
      <button
        className="text-sm underline"
        onClick={onDismiss}
      >
        Dismiss
      </button>
    </div>
  );
};

export default FloodAlertBanner;
