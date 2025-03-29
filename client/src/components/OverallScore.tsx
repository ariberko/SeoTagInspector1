import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SEOMetaTag } from '@shared/schema';
import { ScoreBadge } from './ui/score-badge';
import { CheckIcon, AlertTriangleIcon, XIcon } from 'lucide-react';

interface OverallScoreProps {
  url: string;
  seoData: SEOMetaTag;
}

export default function OverallScore({ url, seoData }: OverallScoreProps) {
  const score = seoData.score || 0;
  const statusChecks = seoData.statusChecks || {};
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckIcon className="h-4 w-4 text-white" />;
      case 'warning':
        return <AlertTriangleIcon className="h-4 w-4 text-white" />;
      case 'error':
        return <XIcon className="h-4 w-4 text-white" />;
      default:
        return null;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-success';
      case 'warning':
        return 'bg-warning';
      case 'error':
        return 'bg-error';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <section className="mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold">SEO Analysis Results</h2>
              <p className="text-sm text-gray-500">{url}</p>
            </div>
            
            <div className="flex items-center mt-4 md:mt-0">
              <ScoreBadge score={score} />
              
              <Button variant="link" className="ml-4 text-sm text-primary hover:text-blue-700 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Export Report
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Title tag status */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className={`h-8 w-8 rounded-full ${getStatusColor(statusChecks.title?.status || 'warning')} flex items-center justify-center`}>
                    {getStatusIcon(statusChecks.title?.status || 'warning')}
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium">Title Tag</h3>
                  <p className="text-xs text-gray-500">{statusChecks.title?.message || 'Not analyzed'}</p>
                </div>
              </div>
            </div>
            
            {/* Meta description status */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className={`h-8 w-8 rounded-full ${getStatusColor(statusChecks.description?.status || 'warning')} flex items-center justify-center`}>
                    {getStatusIcon(statusChecks.description?.status || 'warning')}
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium">Meta Description</h3>
                  <p className="text-xs text-gray-500">{statusChecks.description?.message || 'Not analyzed'}</p>
                </div>
              </div>
            </div>
            
            {/* Canonical tag status */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className={`h-8 w-8 rounded-full ${getStatusColor(statusChecks.canonical?.status || 'warning')} flex items-center justify-center`}>
                    {getStatusIcon(statusChecks.canonical?.status || 'warning')}
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium">Canonical URL</h3>
                  <p className="text-xs text-gray-500">{statusChecks.canonical?.message || 'Not analyzed'}</p>
                </div>
              </div>
            </div>
            
            {/* Social tags status */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className={`h-8 w-8 rounded-full ${getStatusColor(statusChecks.social?.status || 'warning')} flex items-center justify-center`}>
                    {getStatusIcon(statusChecks.social?.status || 'warning')}
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium">Social Tags</h3>
                  <p className="text-xs text-gray-500">{statusChecks.social?.message || 'Not analyzed'}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
