import { SEOMetaTag } from '@shared/schema';
import { truncateString } from '@/lib/seoUtils';
import { SEOTooltip } from '@/components/ui/seo-tooltip';

interface InstagramPreviewProps {
  seoData: SEOMetaTag;
}

export default function InstagramPreview({ seoData }: InstagramPreviewProps) {
  // Instagram primarily uses Open Graph tags for sharing
  // But it prioritizes images with a 1:1 aspect ratio
  const title = seoData.ogTitle || seoData.title || 'No title found';
  const description = seoData.ogDescription || seoData.description || 'No description found';
  const imageUrl = seoData.ogImage || '';
  
  // Determine if we have enough OG tags for a good preview
  const hasRequiredTags = Boolean(seoData.ogTitle && seoData.ogImage);

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-500 mb-4 flex items-center">
        INSTAGRAM PREVIEW
        <SEOTooltip term="Instagram shares rely on Open Graph tags but prefer square images (1:1 aspect ratio)">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </SEOTooltip>
      </h3>
      
      {!hasRequiredTags ? (
        <div className="preview-container rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
          <div className="p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-base font-medium text-gray-600 mb-1">No Instagram Preview Available</h3>
            <p className="text-sm text-gray-500">
              This page is missing the required Open Graph tags for Instagram sharing.
              Add og:title and og:image tags with 1:1 aspect ratio images for best results.
            </p>
          </div>
        </div>
      ) : (
        <div className="preview-container">
          {/* Instagram-style post preview */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Header */}
            <div className="p-3 flex items-center border-b border-gray-200">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium">
                  {seoData.url.split('//')[1]?.split('/')[0] || 'your-website.com'}
                </div>
              </div>
            </div>
            
            {/* Image */}
            {imageUrl ? (
              <div className="w-full aspect-square bg-gray-100">
                <img 
                  src={imageUrl} 
                  alt="Instagram preview" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 800 800'%3E%3Crect fill='%23f3f4f6' width='800' height='800'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14px' fill='%236b7280'%3EImage not available or could not be loaded%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
            ) : (
              <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            
            {/* Caption */}
            <div className="p-3">
              <div className="flex space-x-4 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <div className="text-sm">
                <span className="font-medium">
                  {seoData.url.split('//')[1]?.split('/')[0] || 'your-website.com'}
                </span>{" "}
                {truncateString(description, 100)}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                View all comments
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-4 text-sm">
        <p className="font-medium flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Instagram Sharing Tips
        </p>
        <ul className="mt-2 space-y-2 text-gray-600 pl-5 list-disc">
          <li>{seoData.ogTitle ? 'Open Graph title is present' : 'Add og:title for better Instagram sharing'}</li>
          <li>{seoData.ogImage ? 'Open Graph image is present' : 'Add og:image that works well in a 1:1 aspect ratio'}</li>
          <li>Consider creating dedicated 1:1 aspect ratio (square) images for Instagram sharing</li>
          <li>The first sentence of your og:description should be compelling on its own</li>
        </ul>
      </div>
    </div>
  );
}