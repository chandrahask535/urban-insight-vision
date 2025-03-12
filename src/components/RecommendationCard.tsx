
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RecommendationProps {
  title: string;
  description: string;
  priority: string;
}

const RecommendationCard = ({ title, description, priority }: RecommendationProps) => {
  const priorityColor = 
    priority === 'High' ? 'bg-red-100 text-red-800 border-red-200' :
    priority === 'Medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
    'bg-green-100 text-green-800 border-green-200';
    
  return (
    <Card className="p-4 shadow-sm">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-medium">{title}</h3>
        <Badge variant="outline" className={priorityColor}>
          {priority} Priority
        </Badge>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </Card>
  );
};

export default RecommendationCard;
