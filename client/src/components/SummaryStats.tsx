import { Card, CardContent } from '@/components/ui/card';
import { SEOMetaTag } from '@shared/schema';
import { 
  AlertCircle, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  LayoutGrid, 
  Share2, 
  BarChart,
  Facebook,
  Twitter,
  Instagram
} from 'lucide-react';
import { SEOTooltip } from './ui/seo-tooltip';
import { useTheme } from '@/context/ThemeContext';

interface SummaryStatsProps {
  seoData: SEOMetaTag;
}

export default function SummaryStats({ seoData }: SummaryStatsProps) {
  const { theme } = useTheme();
  const score = seoData.score || 0;
  
  // Count issues by type
  const issueCount = {
    good: 0,
    warning: 0,
    error: 0
  };
  
  // Go through status checks and count issues
  if (seoData.statusChecks) {
    Object.values(seoData.statusChecks).forEach(check => {
      if (check.status && issueCount[check.status] !== undefined) {
        issueCount[check.status]++;
      }
    });
  }
  
  // Calculate totals for the tags
  const socialTagsPresent = [
    seoData.ogTitle, 
    seoData.ogDescription, 
    seoData.ogImage,
    seoData.twitterCard,
    seoData.twitterTitle
  ].filter(Boolean).length;
  
  const socialTagsTotal = 5; // Total expected social tags
  
  // Get heading structure stats
  const headingStructure = {
    h1: seoData.h1?.length || 0,
    h2: seoData.h2?.length || 0,
    h3: seoData.h3?.length || 0,
    total: (seoData.h1?.length || 0) + (seoData.h2?.length || 0) + (seoData.h3?.length || 0)
  };
  
  // Determine time to fix (very rough estimate)
  let timeToFix = 'Quick fix';
  if (issueCount.error > 2 || (issueCount.error > 0 && issueCount.warning > 3)) {
    timeToFix = '> 1 hour';
  } else if (issueCount.error > 0 || issueCount.warning > 2) {
    timeToFix = '30-60 min';
  } else if (issueCount.warning > 0) {
    timeToFix = '< 30 min';
  }
  
  // Calculate overall health status
  const getHealthStatus = () => {
    if (issueCount.error === 0 && issueCount.warning <= 1) {
      return { text: 'Excellent', color: 'text-success', bgColor: 'bg-success-light' };
    } else if (issueCount.error === 0 && issueCount.warning <= 3) {
      return { text: 'Good', color: 'text-success', bgColor: 'bg-success-light' };
    } else if (issueCount.error <= 1 && issueCount.warning <= 4) {
      return { text: 'Fair', color: 'text-warning', bgColor: 'bg-warning-light' };
    } else {
      return { text: 'Poor', color: 'text-error', bgColor: 'bg-error-light' };
    }
  };
  
  const healthStatus = getHealthStatus();
  
  return (
    <section>
      <Card className="shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <BarChart className="h-5 w-5 text-primary mr-2" />
            <SEOTooltip term="seo score">
              <h3 className="font-medium text-lg">SEO Summary</h3>
            </SEOTooltip>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${healthStatus.bgColor} ${healthStatus.color}`}>
            {healthStatus.text}
          </div>
        </div>
        
        <CardContent className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Issues count */}
            <div className="bg-success-light/50 border border-success/20 rounded-lg p-4 flex flex-col items-center justify-center">
              <CheckCircle className="h-8 w-8 text-success mb-2" />
              <span className="text-2xl font-bold text-success">{issueCount.good}</span>
              <span className="text-xs text-gray-600 text-center mt-1">Passed Checks</span>
            </div>
            
            <div className="bg-warning-light/50 border border-warning/20 rounded-lg p-4 flex flex-col items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-warning mb-2" />
              <span className="text-2xl font-bold text-warning">{issueCount.warning}</span>
              <span className="text-xs text-gray-600 text-center mt-1">Warnings</span>
            </div>
            
            <div className="bg-error-light/50 border border-error/20 rounded-lg p-4 flex flex-col items-center justify-center">
              <AlertCircle className="h-8 w-8 text-error mb-2" />
              <span className="text-2xl font-bold text-error">{issueCount.error}</span>
              <span className="text-xs text-gray-600 text-center mt-1">Critical Issues</span>
            </div>
            
            {/* Time to fix */}
            <div className="bg-primary-light/20 border border-primary/20 rounded-lg p-4 flex flex-col items-center justify-center">
              <Clock className="h-8 w-8 text-primary mb-2" />
              <span className="text-md font-bold text-primary">{timeToFix}</span>
              <span className="text-xs text-gray-600 text-center mt-1">Estimated Fix Time</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            {/* Heading structure */}
            <div className="border border-gray-200 rounded-lg p-5 shadow-sm">
              <div className="flex items-center mb-4">
                <LayoutGrid className="h-5 w-5 text-primary mr-2" />
                <SEOTooltip term="h1 tag">
                  <h4 className="text-base font-medium">Heading Structure</h4>
                </SEOTooltip>
              </div>
              
              <div className="space-y-3">
                <div className={`p-2 rounded ${headingStructure.h1 === 1 ? 'bg-success-light' : headingStructure.h1 === 0 ? 'bg-error-light' : 'bg-warning-light'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-2 h-6 rounded-sm mr-2 ${headingStructure.h1 === 1 ? 'bg-success' : headingStructure.h1 === 0 ? 'bg-error' : 'bg-warning'}`}></div>
                      <span className="text-sm">H1 Tags</span>
                    </div>
                    <span className={`font-bold ${
                      headingStructure.h1 === 1 ? 'text-success' : 
                      headingStructure.h1 === 0 ? 'text-error' : 'text-warning'
                    }`}>
                      {headingStructure.h1}
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <div className="flex-1 p-3 bg-gray-100 rounded-lg">
                    <div className="text-center">
                      <div className={`text-lg font-bold ${theme === 'dark' ? 'text-gray-900' : ''}`}>{headingStructure.h2}</div>
                      <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-700' : 'text-gray-600'}`}>H2 Tags</div>
                    </div>
                  </div>
                  
                  <div className="flex-1 p-3 bg-gray-100 rounded-lg">
                    <div className="text-center">
                      <div className={`text-lg font-bold ${theme === 'dark' ? 'text-gray-900' : ''}`}>{headingStructure.h3}</div>
                      <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-700' : 'text-gray-600'}`}>H3 Tags</div>
                    </div>
                  </div>
                  
                  <div className="flex-1 p-3 bg-gray-100 rounded-lg">
                    <div className="text-center">
                      <div className={`text-lg font-bold ${theme === 'dark' ? 'text-gray-900' : ''}`}>{headingStructure.total}</div>
                      <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-700' : 'text-gray-600'}`}>Total</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Social tags coverage */}
            <div className="border border-gray-200 rounded-lg p-5 shadow-sm">
              <div className="flex items-center mb-4">
                <Share2 className="h-5 w-5 text-primary mr-2" />
                <SEOTooltip term="open graph">
                  <h4 className="text-base font-medium">Social Media Coverage</h4>
                </SEOTooltip>
              </div>
              
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Social Tags Coverage</span>
                  <span className={`text-sm font-bold ${
                    socialTagsPresent / socialTagsTotal > 0.7 
                      ? 'text-success' 
                      : socialTagsPresent / socialTagsTotal > 0.4 
                        ? 'text-warning' 
                        : 'text-error'
                  }`}>
                    {Math.round((socialTagsPresent / socialTagsTotal) * 100)}%
                  </span>
                </div>
                
                <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${(socialTagsPresent / socialTagsTotal) * 100}%` }}
                    className={`h-full ${
                      socialTagsPresent / socialTagsTotal > 0.7 
                        ? 'bg-success' 
                        : socialTagsPresent / socialTagsTotal > 0.4 
                          ? 'bg-warning' 
                          : 'bg-error'
                    }`}
                  ></div>
                </div>
                
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{socialTagsPresent} implemented</span>
                  <span>{socialTagsTotal} recommended</span>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className={`p-3 rounded-lg ${seoData.ogTitle && seoData.ogDescription ? 'bg-success-light' : 'bg-error-light'} flex items-center`}>
                  <div className={`h-8 w-8 rounded-full ${seoData.ogTitle && seoData.ogDescription ? 'bg-success' : 'bg-error'} flex items-center justify-center mr-2`}>
                    <Facebook className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <span className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-900' : ''}`}>Facebook</span>
                    <div className={`text-xs ${seoData.ogTitle && seoData.ogDescription ? 'text-success' : 'text-error'}`}>
                      {seoData.ogTitle && seoData.ogDescription ? 'Complete' : 'Incomplete'}
                    </div>
                  </div>
                </div>
                
                <div className={`p-3 rounded-lg ${seoData.twitterCard && seoData.twitterTitle ? 'bg-success-light' : 'bg-error-light'} flex items-center`}>
                  <div className={`h-8 w-8 rounded-full ${seoData.twitterCard && seoData.twitterTitle ? 'bg-success' : 'bg-error'} flex items-center justify-center mr-2`}>
                    <Twitter className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <span className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-900' : ''}`}>Twitter</span>
                    <div className={`text-xs ${seoData.twitterCard && seoData.twitterTitle ? 'text-success' : 'text-error'}`}>
                      {seoData.twitterCard && seoData.twitterTitle ? 'Complete' : 'Incomplete'}
                    </div>
                  </div>
                </div>
                
                <div className={`p-3 rounded-lg ${seoData.ogImage ? 'bg-success-light' : 'bg-error-light'} flex items-center`}>
                  <div className={`h-8 w-8 rounded-full ${seoData.ogImage ? 'bg-success' : 'bg-error'} flex items-center justify-center mr-2`}>
                    <Instagram className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <span className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-900' : ''}`}>Instagram</span>
                    <div className={`text-xs ${seoData.ogImage ? 'text-success' : 'text-error'}`}>
                      {seoData.ogImage ? 'Ready for sharing' : 'Missing image'}
                    </div>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-gray-100 flex items-center">
                  <div className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center mr-2">
                    <Share2 className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <span className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-900' : ''}`}>Overall</span>
                    <div className={`text-xs ${
                      socialTagsPresent / socialTagsTotal > 0.7 
                        ? 'text-success' 
                        : socialTagsPresent / socialTagsTotal > 0.4 
                          ? 'text-warning' 
                          : 'text-error'
                    }`}>
                      {Math.round((socialTagsPresent / socialTagsTotal) * 100)}% optimized
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}