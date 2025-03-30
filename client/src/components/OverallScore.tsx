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
  const getScoreStatus = (score: number): 'good' | 'warning' | 'error' => {
    if (score >= 80) return 'good';
    if (score >= 50) return 'warning';
    return 'error';
  };
  
  // Get the score status once
  const scoreStatus = getScoreStatus(score);
  
  // Handle exporting the SEO report
  const handleExportReport = () => {
    try {
      // Create report data in CSV format
      const reportDate = new Date().toLocaleDateString();
      const csvContent = [
        // Headers
        ['SEO Analysis Report', '', ''],
        [`URL: ${url}`, '', ''],
        [`Date: ${reportDate}`, '', ''],
        [`Overall Score: ${score}/100`, '', ''],
        ['', '', ''],
        ['Factor', 'Status', 'Details'],
        
        // Content rows
        ['Title Tag', statusChecks.title?.status || 'not analyzed', statusChecks.title?.message || ''],
        ['Meta Description', statusChecks.description?.status || 'not analyzed', statusChecks.description?.message || ''],
        ['Canonical URL', statusChecks.canonical?.status || 'not analyzed', statusChecks.canonical?.message || ''],
        ['Social Tags', statusChecks.social?.status || 'not analyzed', statusChecks.social?.message || ''],
        ['Heading Structure', seoData.h1?.length === 1 ? 'good' : 'needs improvement', `H1: ${seoData.h1?.length || 0}, H2: ${seoData.h2?.length || 0}, H3: ${seoData.h3?.length || 0}`],
        ['', '', ''],
        ['Recommendations:', '', ''],
      ];
      
      // Add recommendations if available
      if (seoData.recommendations && seoData.recommendations.length > 0) {
        seoData.recommendations.forEach((rec, index) => {
          csvContent.push([`${index + 1}. ${rec.title}`, rec.type, rec.description]);
        });
      }
      
      // Convert arrays to CSV string
      const csv = csvContent.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
      
      // Create a blob and download link
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', downloadUrl);
      link.setAttribute('download', `seo-report-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error generating report:', err);
      alert('Failed to generate report. Please try again.');
    }
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
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center" 
                  onClick={handleExportReport}
                >
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
                
                <div className="text-xs text-gray-500 ml-auto">
                  Last analyzed: {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
            
            {/* Right content - Score Card */}
            <div className={`lg:col-span-4 p-6 lg:p-8 flex items-center justify-center lg:border-l border-gray-200 bg-gradient-to-br ${
              scoreStatus === 'good' ? 'from-success-light/30 to-success-light/10' : 
              scoreStatus === 'warning' ? 'from-warning-light/30 to-warning-light/10' : 
              'from-error-light/30 to-error-light/10'
            }`}>
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-white rounded-full blur-md opacity-50"></div>
                  <div className="relative z-10">
                    <CircularProgress 
                      value={score} 
                      size={180} 
                      strokeWidth={12}
                      showValue
                      valueClassName="text-4xl font-bold"
                      status={scoreStatus}
                    />
                    <div className="absolute -top-2 -right-2">
                      <div className={`flex items-center justify-center h-12 w-12 rounded-full shadow-lg ${
                        scoreStatus === 'good' ? 'bg-gradient-to-br from-success to-green-600' : 
                        scoreStatus === 'warning' ? 'bg-gradient-to-br from-warning to-amber-600' : 
                        'bg-gradient-to-br from-error to-red-600'
                      }`}>
                        <span className="text-white font-bold text-lg">{getScoreGrade(score)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <h3 className={`text-2xl font-bold ${
                  scoreStatus === 'good' ? 'text-success' : 
                  scoreStatus === 'warning' ? 'text-warning' : 
                  'text-error'
                }`}>
                  {getScoreLabel(score)}
                </h3>
                
                <p className="text-sm text-gray-600 mt-3 mb-4 max-w-[240px] mx-auto">
                  {scoreStatus === 'good' 
                    ? 'Your website follows most SEO best practices!' 
                    : scoreStatus === 'warning'
                    ? 'Your site needs some improvements to rank better.'
                    : 'Your website needs significant SEO improvements.'
                  }
                </p>
                
                <div className={`flex items-center justify-center gap-2 py-2 px-4 rounded-full mx-auto w-fit ${
                  scoreStatus === 'good' ? 'bg-success/10' : 
                  scoreStatus === 'warning' ? 'bg-warning/10' : 
                  'bg-error/10'
                }`}>
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
