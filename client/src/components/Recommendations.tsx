import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, AlertCircle, Check } from 'lucide-react';

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

  const getIcon = (type: Recommendation['type']) => {
    switch (type) {
      case 'success':
        return <Check className="h-5 w-5 text-success" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-error" />;
      case 'info':
      default:
        return <AlertCircle className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <section>
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-medium">Recommendations</h3>
        </div>
        
        <CardContent className="p-6 pt-4">
          <ul className="space-y-4 text-sm">
            {recommendations.map((recommendation, index) => (
              <li key={index} className="flex">
                <div className="flex-shrink-0">
                  {getIcon(recommendation.type)}
                </div>
                <p className="ml-3 text-gray-700">
                  <span className="font-medium text-gray-900 block">{recommendation.title}</span>
                  {recommendation.description}
                </p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}
