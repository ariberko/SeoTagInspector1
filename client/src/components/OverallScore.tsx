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
  ShieldIcon,
  SearchIcon
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
  
  // Generate related search terms based on the title and URL
  const generateRelatedSearches = (title: string, searchUrl: string): string[] => {
    // Extract the domain name to construct better suggestions
    let domain = '';
    try {
      const urlObj = new URL(searchUrl);
      domain = urlObj.hostname.replace(/^www\./, '');
      domain = domain.split('.')[0]; // Just the first part of the domain
    } catch {
      domain = 'site';
    }
    
    // Extract keywords from title
    const keywords = title.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(' ')
      .filter(word => word.length > 3) // Filter out short words
      .slice(0, 3); // Take up to 3 words
    
    // Create alternatives and questions
    const searches = [];
    
    // If we have keywords, generate search suggestions
    if (keywords.length) {
      const alternatives = [
        `best ${keywords[0]} alternatives`,
        `${keywords[0]} vs ${domain} comparison`,
        `${keywords.slice(0, 2).join(' ')} for ${Math.random() > 0.5 ? 'beginners' : 'professionals'}`
      ];
      
      const questions = [
        `how to ${keywords[0]} without ${domain}`,
        `why ${keywords[0]} ${Math.random() > 0.5 ? 'matters' : 'is important'}`,
        `${keywords.slice(0, 2).join(' ')} tutorial`
      ];
      
      // Mix alternatives and questions
      searches.push(
        alternatives[Math.floor(Math.random() * alternatives.length)],
        questions[Math.floor(Math.random() * questions.length)]
      );
    }
    
    // Add a generic one based on domain
    searches.push(`${domain} ${Math.random() > 0.5 ? 'review' : 'tutorial'}`);
    
    // Return unique searches
    return Array.from(new Set(searches)).slice(0, 3);
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
            <div className="lg:col-span-4 lg:border-l border-gray-200">
              <div className={`p-6 lg:p-8 ${
                scoreStatus === 'good' ? 'bg-green-50' : 
                scoreStatus === 'warning' ? 'bg-amber-50' : 
                'bg-red-50'
              }`}>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-base font-semibold text-gray-700">SEO Health Score</h3>
                  <div className={`text-xs font-bold px-2 py-1 rounded-md ${
                    scoreStatus === 'good' ? 'bg-success text-white' : 
                    scoreStatus === 'warning' ? 'bg-warning text-white' : 
                    'bg-error text-white'
                  }`}>
                    Grade: {getScoreGrade(score)}
                  </div>
                </div>
                
                <div className="flex items-center mb-6">
                  <div className="mr-4">
                    <CircularProgress 
                      value={score} 
                      size={100} 
                      strokeWidth={8}
                      showValue
                      valueClassName={`text-2xl font-bold ${
                        scoreStatus === 'good' ? 'text-success' : 
                        scoreStatus === 'warning' ? 'text-warning' : 
                        'text-error'
                      }`}
                      status={scoreStatus}
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className={`text-xl font-bold ${
                      scoreStatus === 'good' ? 'text-success' : 
                      scoreStatus === 'warning' ? 'text-warning' : 
                      'text-error'
                    }`}>
                      {getScoreLabel(score)}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {scoreStatus === 'good' 
                        ? 'Your website follows most SEO best practices!' 
                        : scoreStatus === 'warning'
                        ? 'Your site needs some improvements to rank better.'
                        : 'Your website needs significant SEO improvements.'
                      }
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Key Issues:</h4>
                  <ul className="text-sm text-gray-600 space-y-1 pl-5 list-disc">
                    {scoreStatus === 'good' ? (
                      <>
                        <li>Minor optimizations may still improve ranking</li>
                        <li>Continue monitoring for changes in SEO standards</li>
                        <li>Consider improving content freshness</li>
                      </>
                    ) : scoreStatus === 'warning' ? (
                      <>
                        <li>Meta descriptions need improvement</li>
                        <li>Heading structure can be optimized</li>
                        <li>Consider adding more structured data</li>
                      </>
                    ) : (
                      <>
                        <li>Missing or poor meta tags</li>
                        <li>Incomplete social media optimization</li>
                        <li>Page structure needs significant work</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
              
              {/* Related Searches Section */}
              <div className="p-6 border-t border-gray-200">
                <h3 className="text-base font-semibold text-gray-700 mb-3">
                  Potential Related Search Terms
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  Search terms users might use related to your content
                </p>
                
                <div className="space-y-3">
                  {seoData.title ? (
                    generateRelatedSearches(seoData.title, url).map((search: string, index: number) => (
                      <div key={index} className="flex items-center bg-gray-50 p-3 rounded-lg">
                        <div className="flex-shrink-0 text-primary mr-3">
                          <GlobeIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{search}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500 italic">
                      No title information available for analysis
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
