import { Card, CardContent } from '@/components/ui/card';
import { SEOMetaTag } from '@shared/schema';
import { StatusBadge, ProgressBar } from './ui/score-badge';
import { calculateTitleStatus, calculateDescriptionStatus } from '@/lib/seoUtils';
import { Check, X } from 'lucide-react';

interface DetailedAnalysisProps {
  seoData: SEOMetaTag;
}

export default function DetailedAnalysis({ seoData }: DetailedAnalysisProps) {
  // Title analysis
  const titleLength = seoData.title?.length || 0;
  const titleStatus = calculateTitleStatus(titleLength);
  const titlePercentage = Math.min(100, (titleLength / 60) * 100);
  
  // Description analysis
  const descriptionLength = seoData.description?.length || 0;
  const descriptionStatus = calculateDescriptionStatus(descriptionLength);
  const descriptionPercentage = Math.min(100, (descriptionLength / 160) * 100);
  
  // Heading tags counts
  const h1Count = seoData.h1?.length || 0;
  const h2Count = seoData.h2?.length || 0;
  const h3Count = seoData.h3?.length || 0;
  
  // Calculate heading status
  const headingStatus = h1Count === 1 ? 'good' : h1Count === 0 ? 'error' : 'warning';
  
  // Social tags analysis
  const hasOgTags = Boolean(seoData.ogTitle && seoData.ogDescription);
  const hasTwitterTags = Boolean(seoData.twitterCard && seoData.twitterTitle);
  const socialStatus = hasOgTags && hasTwitterTags ? 'good' : !hasOgTags && !hasTwitterTags ? 'error' : 'warning';
  
  // Get background color and text color based on status
  const getStatusColors = (status: 'good' | 'warning' | 'error') => {
    const colors = {
      good: 'bg-success-light text-success',
      warning: 'bg-warning-light text-warning',
      error: 'bg-error-light text-error'
    };
    return colors[status];
  };
  
  return (
    <section>
      <Card className="overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-medium text-lg">Detailed Tag Analysis</h3>
        </div>
        
        <CardContent className="p-6 pt-4">
          <div className="space-y-6">
            {/* Title Tag Analysis */}
            <div className={`p-4 rounded-lg border border-opacity-20 ${
              titleStatus === 'good' ? 'border-success bg-success-light/30' : 
              titleStatus === 'warning' ? 'border-warning bg-warning-light/30' : 
              'border-error bg-error-light/30'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-semibold">Title Tag</h4>
                <StatusBadge status={titleStatus}>
                  {titleStatus === 'good' ? 'Good' : titleStatus === 'warning' ? 'Improve' : 'Poor'}
                </StatusBadge>
              </div>
              <p className="mt-2 text-sm break-words">{seoData.title || 'No title found'}</p>
              <div className="mt-3">
                <ProgressBar percentage={titlePercentage} status={titleStatus} />
                <div className="mt-1 flex justify-between text-xs text-gray-500">
                  <span>{titleLength} characters</span>
                  <span>Recommended: 50-60</span>
                </div>
              </div>
            </div>
            
            {/* Meta Description Analysis */}
            <div className={`p-4 rounded-lg border border-opacity-20 ${
              descriptionStatus === 'good' ? 'border-success bg-success-light/30' : 
              descriptionStatus === 'warning' ? 'border-warning bg-warning-light/30' : 
              'border-error bg-error-light/30'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-semibold">Meta Description</h4>
                <StatusBadge status={descriptionStatus}>
                  {descriptionStatus === 'good' ? 'Good' : descriptionStatus === 'warning' ? 'Improve' : 'Poor'}
                </StatusBadge>
              </div>
              <p className="mt-2 text-sm break-words">{seoData.description ? seoData.description.substring(0, 120) + (seoData.description.length > 120 ? '...' : '') : 'No description found'}</p>
              <div className="mt-3">
                <ProgressBar percentage={descriptionPercentage} status={descriptionStatus} />
                <div className="mt-1 flex justify-between text-xs text-gray-500">
                  <span>{descriptionLength} characters</span>
                  <span>Recommended: 150-160</span>
                </div>
              </div>
            </div>
            
            {/* Heading Tags Analysis */}
            <div className={`p-4 rounded-lg border border-opacity-20 ${
              headingStatus === 'good' ? 'border-success bg-success-light/30' : 
              headingStatus === 'warning' ? 'border-warning bg-warning-light/30' : 
              'border-error bg-error-light/30'
            }`}>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">Heading Tags</h4>
                <StatusBadge status={headingStatus}>
                  {headingStatus === 'good' ? 'Good' : headingStatus === 'warning' ? 'Improve' : 'Poor'}
                </StatusBadge>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className={`p-3 rounded text-center ${getStatusColors(h1Count === 1 ? 'good' : h1Count === 0 ? 'error' : 'warning')}`}>
                  <div className="font-bold text-xl">{h1Count}</div>
                  <div className="text-xs font-medium mt-1">H1 Tags</div>
                </div>
                <div className="p-3 rounded bg-gray-100 text-center">
                  <div className="font-bold text-xl">{h2Count}</div>
                  <div className="text-xs font-medium text-gray-600 mt-1">H2 Tags</div>
                </div>
                <div className="p-3 rounded bg-gray-100 text-center">
                  <div className="font-bold text-xl">{h3Count}</div>
                  <div className="text-xs font-medium text-gray-600 mt-1">H3 Tags</div>
                </div>
              </div>
            </div>

            {/* Canonical URL Analysis */}
            <div className={`p-4 rounded-lg border border-opacity-20 ${
              seoData.canonical ? 'border-success bg-success-light/30' : 'border-warning bg-warning-light/30'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-semibold">Canonical URL</h4>
                <StatusBadge status={seoData.canonical ? 'good' : 'warning'}>
                  {seoData.canonical ? 'Good' : 'Missing'}
                </StatusBadge>
              </div>
              <p className="mt-2 text-sm break-words">{seoData.canonical || 'No canonical URL found'}</p>
            </div>
            
            {/* Social Tags Analysis */}
            <div className={`p-4 rounded-lg border border-opacity-20 ${
              socialStatus === 'good' ? 'border-success bg-success-light/30' : 
              socialStatus === 'warning' ? 'border-warning bg-warning-light/30' : 
              'border-error bg-error-light/30'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-semibold">Social Tags</h4>
                <StatusBadge status={socialStatus}>
                  {socialStatus === 'good' ? 'Complete' : socialStatus === 'warning' ? 'Partial' : 'Missing'}
                </StatusBadge>
              </div>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className={`p-3 rounded ${hasOgTags ? 'bg-success-light' : 'bg-error-light'} flex items-center`}>
                  <div className={`h-6 w-6 rounded-full ${hasOgTags ? 'bg-success' : 'bg-error'} flex items-center justify-center mr-2`}>
                    {hasOgTags ? (
                      <Check className="h-4 w-4 text-white" />
                    ) : (
                      <X className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <span className={`text-sm font-medium ${hasOgTags ? 'text-success' : 'text-error'}`}>
                    Open Graph Tags
                  </span>
                </div>
                
                <div className={`p-3 rounded ${hasTwitterTags ? 'bg-success-light' : 'bg-error-light'} flex items-center`}>
                  <div className={`h-6 w-6 rounded-full ${hasTwitterTags ? 'bg-success' : 'bg-error'} flex items-center justify-center mr-2`}>
                    {hasTwitterTags ? (
                      <Check className="h-4 w-4 text-white" />
                    ) : (
                      <X className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <span className={`text-sm font-medium ${hasTwitterTags ? 'text-success' : 'text-error'}`}>
                    Twitter Card Tags
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
