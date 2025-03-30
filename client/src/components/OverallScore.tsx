import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SEOMetaTag } from '@shared/schema';
import { CircularProgress } from './ui/circular-progress';
import { 
  CheckIcon, 
  AlertTriangleIcon, 
  XIcon, 
  DownloadIcon, 
  RefreshCwIcon, 
  GlobeIcon, 
  ExternalLinkIcon,
  BadgeCheckIcon,
  ShieldIcon
} from 'lucide-react';

interface OverallScoreProps {
  url: string;
  seoData: SEOMetaTag;
  onRefresh?: () => void;
}

export default function OverallScore({ url, seoData, onRefresh }: OverallScoreProps) {
  const score = seoData.score || 0;
  const statusChecks = seoData.statusChecks || {};
  
  // Determine score status for circular progress
  const getScoreStatus = (score: number) => {
    if (score >= 80) return 'good';
    if (score >= 50) return 'warning';
    return 'error';
  };
  
  // Get label based on score
  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Good';
    if (score >= 50) return 'Needs Improvement';
    return 'Poor';
  };
  
  // Get grade based on score
  const getScoreGrade = (score: number) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };
  
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

  // Format URL for display (removing protocol)
  const displayUrl = () => {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.startsWith('www.') ? urlObj.hostname.substring(4) : urlObj.hostname;
      return hostname + urlObj.pathname;
    } catch {
      return url;
    }
  };
  
  const scoreStatus = getScoreStatus(score);

  return (
    <section>
      <Card className="overflow-hidden shadow-md">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left content */}
            <div className="lg:col-span-8 p-6 lg:p-8">
              <div className="flex items-center mb-2">
                <GlobeIcon className="h-5 w-5 text-primary mr-2" />
                <div className="text-base text-gray-500 font-medium">
                  Analysis Results
                </div>
              </div>
              
              <div className="flex items-center flex-wrap mb-2">
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-blue-500 text-transparent bg-clip-text">
                  {displayUrl()}
                </h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-2 text-gray-500 h-8 px-2"
                  asChild
                >
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    <ExternalLinkIcon className="h-4 w-4 mr-1" />
                    <span className="text-xs">Visit</span>
                  </a>
                </Button>
              </div>
              
              <div className="text-gray-600 mb-6">
                <p className="font-medium">{seoData.title || 'No title found'}</p>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{seoData.description || 'No description found'}</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Title tag status */}
                <div className={`rounded-lg shadow-sm p-4 border border-opacity-30 transition-all ${
                  statusChecks.title?.status === 'good' ? 'bg-success-light/30 border-success hover:bg-success-light/50' : 
                  statusChecks.title?.status === 'error' ? 'bg-error-light/30 border-error hover:bg-error-light/50' : 
                  'bg-warning-light/30 border-warning hover:bg-warning-light/50'
                }`}>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className={`h-8 w-8 rounded-full ${getStatusColor(statusChecks.title?.status || 'warning')} flex items-center justify-center`}>
                        {getStatusIcon(statusChecks.title?.status || 'warning')}
                      </div>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-semibold">Title Tag</h3>
                      <p className="text-xs text-gray-600 mt-1">{statusChecks.title?.message || 'Not analyzed'}</p>
                    </div>
                  </div>
                </div>
                
                {/* Meta description status */}
                <div className={`rounded-lg shadow-sm p-4 border border-opacity-30 transition-all ${
                  statusChecks.description?.status === 'good' ? 'bg-success-light/30 border-success hover:bg-success-light/50' : 
                  statusChecks.description?.status === 'error' ? 'bg-error-light/30 border-error hover:bg-error-light/50' : 
                  'bg-warning-light/30 border-warning hover:bg-warning-light/50'
                }`}>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className={`h-8 w-8 rounded-full ${getStatusColor(statusChecks.description?.status || 'warning')} flex items-center justify-center`}>
                        {getStatusIcon(statusChecks.description?.status || 'warning')}
                      </div>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-semibold">Meta Description</h3>
                      <p className="text-xs text-gray-600 mt-1">{statusChecks.description?.message || 'Not analyzed'}</p>
                    </div>
                  </div>
                </div>
                
                {/* Canonical tag status */}
                <div className={`rounded-lg shadow-sm p-4 border border-opacity-30 transition-all ${
                  statusChecks.canonical?.status === 'good' ? 'bg-success-light/30 border-success hover:bg-success-light/50' : 
                  statusChecks.canonical?.status === 'error' ? 'bg-error-light/30 border-error hover:bg-error-light/50' : 
                  'bg-warning-light/30 border-warning hover:bg-warning-light/50'
                }`}>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className={`h-8 w-8 rounded-full ${getStatusColor(statusChecks.canonical?.status || 'warning')} flex items-center justify-center`}>
                        {getStatusIcon(statusChecks.canonical?.status || 'warning')}
                      </div>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-semibold">Canonical URL</h3>
                      <p className="text-xs text-gray-600 mt-1">{statusChecks.canonical?.message || 'Not analyzed'}</p>
                    </div>
                  </div>
                </div>
                
                {/* Social tags status */}
                <div className={`rounded-lg shadow-sm p-4 border border-opacity-30 transition-all ${
                  statusChecks.social?.status === 'good' ? 'bg-success-light/30 border-success hover:bg-success-light/50' : 
                  statusChecks.social?.status === 'error' ? 'bg-error-light/30 border-error hover:bg-error-light/50' : 
                  'bg-warning-light/30 border-warning hover:bg-warning-light/50'
                }`}>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className={`h-8 w-8 rounded-full ${getStatusColor(statusChecks.social?.status || 'warning')} flex items-center justify-center`}>
                        {getStatusIcon(statusChecks.social?.status || 'warning')}
                      </div>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-semibold">Social Tags</h3>
                      <p className="text-xs text-gray-600 mt-1">{statusChecks.social?.message || 'Not analyzed'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 mt-6">
                {onRefresh && (
                  <Button 
                    onClick={onRefresh} 
                    variant="outline" 
                    className="flex items-center"
                    size="sm"
                  >
                    <RefreshCwIcon className="h-4 w-4 mr-2" />
                    Refresh Analysis
                  </Button>
                )}
                
                <Button variant="outline" size="sm" className="flex items-center">
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
                
                <div className="text-xs text-gray-500 ml-auto">
                  Last analyzed: {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
            
            {/* Right content - Score Card */}
            <div className={`lg:col-span-4 p-6 lg:p-8 flex items-center justify-center lg:border-l border-gray-200 ${
              scoreStatus === 'good' ? 'bg-success-light/20' : 
              scoreStatus === 'warning' ? 'bg-warning-light/20' : 
              'bg-error-light/20'
            }`}>
              <div className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="relative">
                    <CircularProgress 
                      value={score} 
                      size={150} 
                      strokeWidth={10}
                      showValue
                      valueClassName="text-3xl font-bold"
                      status={scoreStatus}
                    />
                    <div className="absolute -top-1 -right-1">
                      <div className={`flex items-center justify-center h-10 w-10 rounded-full ${scoreStatus === 'good' ? 'bg-success' : scoreStatus === 'warning' ? 'bg-warning' : 'bg-error'}`}>
                        <span className="text-white font-bold">{getScoreGrade(score)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <h3 className={`text-xl font-bold ${
                  scoreStatus === 'good' ? 'text-success' : 
                  scoreStatus === 'warning' ? 'text-warning' : 
                  'text-error'
                }`}>
                  {getScoreLabel(score)}
                </h3>
                
                <p className="text-sm text-gray-600 mt-2 mb-4 max-w-[240px] mx-auto">
                  {scoreStatus === 'good' 
                    ? 'Your website follows most SEO best practices!' 
                    : scoreStatus === 'warning'
                    ? 'Your site needs some improvements to rank better.'
                    : 'Your website needs significant SEO improvements.'
                  }
                </p>
                
                <div className="flex items-center justify-center gap-2">
                  <ShieldIcon className={`h-5 w-5 ${
                    scoreStatus === 'good' ? 'text-success' : 
                    scoreStatus === 'warning' ? 'text-warning' : 
                    'text-error'
                  }`} />
                  
                  <span className="text-sm font-medium">SEO Health Score</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
