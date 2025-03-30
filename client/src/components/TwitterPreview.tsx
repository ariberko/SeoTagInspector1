import { SEOMetaTag } from '@shared/schema';
import { truncateString } from '@/lib/seoUtils';

interface TwitterPreviewProps {
  seoData: SEOMetaTag;
}

export default function TwitterPreview({ seoData }: TwitterPreviewProps) {
  // Use Twitter tags if available, fallback to OG tags, then to regular meta tags
  const title = seoData.twitterTitle || seoData.ogTitle || seoData.title || 'No title found';
  const description = seoData.twitterDescription || seoData.ogDescription || seoData.description || 'No description found';
  const imageUrl = seoData.twitterImage || seoData.ogImage || '';
  
  // Determine if we have Twitter Card tags
  const hasTwitterTags = Boolean(seoData.twitterCard && seoData.twitterTitle);
  const recommendedImplementation = `<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@${seoData.url.split('//')[1]?.split('.')[0] || 'yourbrand'}">
<meta name="twitter:title" content="${truncateString(seoData.title || 'Your Page Title', 70)}">
<meta name="twitter:description" content="${truncateString(seoData.description || 'Your page description', 200)}">
<meta name="twitter:image" content="https://example.com/image.jpg">`;

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-500 mb-4">TWITTER CARD PREVIEW</h3>
      
      {!hasTwitterTags ? (
        <div className="preview-container rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
          <div className="p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-base font-medium text-gray-600 mb-1">No Twitter Card Available</h3>
            <p className="text-sm text-gray-500">
              This page is missing the required Twitter Card meta tags.
              Add twitter:card, twitter:title, and twitter:description tags to enable sharing on Twitter.
            </p>
          </div>
        </div>
      ) : (
        <div className="preview-container rounded-lg overflow-hidden border border-gray-200">
          {imageUrl ? (
            <div className="h-52 bg-gray-200">
              <img 
                src={imageUrl} 
                alt="Twitter Card preview" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 800 400'%3E%3Crect fill='%23f3f4f6' width='800' height='400'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14px' fill='%236b7280'%3EImage not available or could not be loaded%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>
          ) : (
            <div className="h-52 bg-gray-200 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          <div className="p-3 bg-gray-100">
            <div className="text-base font-medium mb-1">{truncateString(title, 70)}</div>
            <div className="text-sm text-gray-600">{truncateString(description, 200)}</div>
          </div>
        </div>
      )}
      
      <div className="mt-4 text-sm">
        {!hasTwitterTags && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  No Twitter Card meta tags found. Adding these will improve how your content appears when shared on Twitter.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className={hasTwitterTags ? "mt-4" : "mt-4"}>
          <p className="font-medium">{hasTwitterTags ? "Implementation:" : "Recommended Implementation:"}</p>
          <pre className="bg-gray-800 text-gray-200 p-3 rounded text-xs mt-2 overflow-x-auto">
            <code>{hasTwitterTags ? 
              `<meta name="twitter:card" content="${seoData.twitterCard || 'summary_large_image'}">
${seoData.twitterSite ? `<meta name="twitter:site" content="${seoData.twitterSite}">` : ''}
<meta name="twitter:title" content="${seoData.twitterTitle || ''}">
<meta name="twitter:description" content="${seoData.twitterDescription || ''}">
${seoData.twitterImage ? `<meta name="twitter:image" content="${seoData.twitterImage}">` : ''}`
              : recommendedImplementation}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}