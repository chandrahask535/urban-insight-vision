
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';
import { WaterBodyData } from '../services/api';

interface WaterLevelCardProps {
  waterBody: WaterBodyData;
}

const WaterLevelCard = ({ waterBody }: WaterLevelCardProps) => {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Critical': return 'bg-red-600';
      case 'High': return 'bg-red-500';
      case 'Moderate': return 'bg-orange-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  const getChangeIcon = () => {
    if (waterBody.changeRate > 0.5) return <ArrowUp className="h-4 w-4 text-red-500" />;
    if (waterBody.changeRate < -0.5) return <ArrowDown className="h-4 w-4 text-green-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  return (
    <Card className="shadow-sm p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium">{waterBody.name}</h3>
        <div className={`text-xs px-2 py-1 rounded text-white ${getRiskColor(waterBody.riskLevel)}`}>
          {waterBody.riskLevel}
        </div>
      </div>
      
      <Progress value={waterBody.currentLevel} className="h-2 mb-1" />
      
      <div className="flex justify-between text-xs text-gray-500 mt-1 mb-2">
        <span>0%</span>
        <span>Current Level: {waterBody.currentLevel}%</span>
        <span>100%</span>
      </div>
      
      <div className="flex items-center text-sm">
        {getChangeIcon()}
        <span className="ml-1">
          {waterBody.changeRate > 0 ? '+' : ''}{waterBody.changeRate}% per day
        </span>
      </div>
    </Card>
  );
};

export default WaterLevelCard;
