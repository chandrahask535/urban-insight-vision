
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PredictionChartProps {
  data: any[];
  dataKey: string;
  name?: string;
  stroke?: string;
  fill?: string;
  gradient?: boolean;
  yAxisLabel?: string;
  height?: number;
}

const PredictionChart = ({ 
  data, 
  dataKey, 
  name = 'Value',  
  stroke = 'hsl(var(--primary))', 
  fill = 'hsl(var(--primary))',
  gradient = true,
  yAxisLabel,
  height = 300
}: PredictionChartProps) => {
  return (
    <div className="w-full" style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            {gradient && (
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={fill} stopOpacity={0.8} />
                <stop offset="95%" stopColor={fill} stopOpacity={0.1} />
              </linearGradient>
            )}
          </defs>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="date" />
          <YAxis label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsla(var(--background))', 
              borderColor: 'hsla(var(--border))',
              borderRadius: '0.375rem'
            }} 
          />
          <Area 
            type="monotone" 
            dataKey={dataKey} 
            name={name}
            stroke={stroke} 
            fill={gradient ? "url(#colorGradient)" : fill} 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PredictionChart;
