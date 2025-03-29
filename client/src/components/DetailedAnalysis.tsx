import { Card, CardContent } from '@/components/ui/card';
import { SEOMetaTag } from '@shared/schema';
import { StatusBadge, ProgressBar } from './ui/score-badge';
import { calculateTitleStatus, calculateDescriptionStatus } from '@/lib/seoUtils';

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
  
  return (
    <section className="mb-8">
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-medium">Detailed Tag Analysis</h3>
        </div>
        
        <CardContent className="p-6 pt-4">
          <div className="space-y-6">
            {/* Title Tag Analysis */}
            <div>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Title Tag</h4>
                <StatusBadge status={titleStatus}>
                  {titleStatus === 'good' ? 'Good' : titleStatus === 'warning' ? 'Improve' : 'Poor'}
                </StatusBadge>
              </div>
              <p className="mt-1 text-sm text-gray-600 truncate">{seoData.title || 'No title found'}</p>
              <ProgressBar percentage={titlePercentage} status={titleStatus} className="mt-1" />
              <div className="mt-1 flex justify-between text-xs text-gray-500">
                <span>{titleLength} characters</span>
                <span>Recommended: 50-60</span>
              </div>
            </div>
            
            {/* Meta Description Analysis */}
            <div>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Meta Description</h4>
                <StatusBadge status={descriptionStatus}>
                  {descriptionStatus === 'good' ? 'Good' : descriptionStatus === 'warning' ? 'Improve' : 'Poor'}
                </StatusBadge>
              </div>
              <p className="mt-1 text-sm text-gray-600">{seoData.description ? seoData.description.substring(0, 120) + (seoData.description.length > 120 ? '...' : '') : 'No description found'}</p>
              <ProgressBar percentage={descriptionPercentage} status={descriptionStatus} className="mt-1" />
              <div className="mt-1 flex justify-between text-xs text-gray-500">
                <span>{descriptionLength} characters</span>
                <span>Recommended: 150-160</span>
              </div>
            </div>
            
            {/* Heading Tags Analysis */}
            <div>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Heading Tags</h4>
                <StatusBadge status={headingStatus}>
                  {headingStatus === 'good' ? 'Good' : headingStatus === 'warning' ? 'Improve' : 'Poor'}
                </StatusBadge>
              </div>
              <ul className="mt-2 space-y-2 text-sm text-gray-600">
                <li className="flex justify-between">
                  <span>H1 tags</span>
                  <span className="font-medium">{h1Count}</span>
                </li>
                <li className="flex justify-between">
                  <span>H2 tags</span>
                  <span className="font-medium">{h2Count}</span>
                </li>
                <li className="flex justify-between">
                  <span>H3 tags</span>
                  <span className="font-medium">{h3Count}</span>
                </li>
              </ul>
            </div>

            {/* Canonical URL Analysis */}
            <div>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Canonical URL</h4>
                <StatusBadge status={seoData.canonical ? 'good' : 'warning'}>
                  {seoData.canonical ? 'Good' : 'Missing'}
                </StatusBadge>
              </div>
              <p className="mt-1 text-sm text-gray-600 break-words">{seoData.canonical || 'No canonical URL found'}</p>
            </div>
            
            {/* Social Tags Analysis */}
            <div>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Social Tags</h4>
                <StatusBadge status={socialStatus}>
                  {socialStatus === 'good' ? 'Complete' : socialStatus === 'warning' ? 'Partial' : 'Missing'}
                </StatusBadge>
              </div>
              <ul className="mt-2 space-y-2 text-sm">
                <li className="flex items-center">
                  {hasOgTags ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-success mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-error mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  <span>Open Graph tags</span>
                </li>
                <li className="flex items-center">
                  {hasTwitterTags ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-success mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-error mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  <span>Twitter Card tags</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
