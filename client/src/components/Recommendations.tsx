import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, AlertCircle, Check, BellRing, Info } from 'lucide-react';

interface Recommendation {
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  description: string;
}

interface RecommendationsProps {
  recommendations: Recommendation[];
}

export default function Recommendations({ recommendations }: RecommendationsProps) {
  if (!recommendations.length) {
    return null;
  }

  const getRecommendationStyle = (type: Recommendation['type']) => {
    switch (type) {
      case 'success':
        return {
          icon: <Check className="h-5 w-5 text-white" />,
          bgColor: 'bg-success',
          borderColor: 'border-success',
          lightBg: 'bg-success-light'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="h-5 w-5 text-white" />,
          bgColor: 'bg-warning',
          borderColor: 'border-warning',
          lightBg: 'bg-warning-light'
        };
      case 'error':
        return {
          icon: <BellRing className="h-5 w-5 text-white" />,
          bgColor: 'bg-error',
          borderColor: 'border-error',
          lightBg: 'bg-error-light'
        };
      case 'info':
      default:
        return {
          icon: <Info className="h-5 w-5 text-white" />,
          bgColor: 'bg-primary',
          borderColor: 'border-primary',
          lightBg: 'bg-primary/5'
        };
    }
  };

  return (
    <section>
      <Card className="overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-medium text-lg">Recommendations</h3>
          <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
            {recommendations.length} {recommendations.length === 1 ? 'item' : 'items'}
          </span>
        </div>
        
        <CardContent className="p-6 pt-4">
          <ul className="space-y-4 text-sm">
            {recommendations.map((recommendation, index) => {
              const style = getRecommendationStyle(recommendation.type);
              
              return (
                <li key={index} className={`p-3 rounded-lg ${style.lightBg} border ${recommendation.type === 'success' ? 'border-success' : recommendation.type === 'warning' ? 'border-warning' : recommendation.type === 'error' ? 'border-error' : 'border-primary'} border-opacity-30`}>
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 h-7 w-7 rounded-full ${style.bgColor} flex items-center justify-center`}>
                      {style.icon}
                    </div>
                    <div className="ml-3">
                      <span className="font-semibold block mb-1">{recommendation.title}</span>
                      <p className="text-gray-700">{recommendation.description}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}
