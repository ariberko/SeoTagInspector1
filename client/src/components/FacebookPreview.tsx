import { SEOMetaTag } from '@shared/schema';
import { truncateString } from '@/lib/seoUtils';

interface FacebookPreviewProps {
  seoData: SEOMetaTag;
}

export default function FacebookPreview({ seoData }: FacebookPreviewProps) {
  // Get hostname from URL
  let hostname = '';
  try {
    const url = new URL(seoData.url);
    hostname = url.hostname;
  } catch (e) {
    hostname = seoData.url;
  }

  // Use OG tags if available, fallback to regular meta tags
  const title = seoData.ogTitle || seoData.title || 'No title found';
  const description = seoData.ogDescription || seoData.description || 'No description found';
  const imageUrl = seoData.ogImage || '';
  
  // Determine if we have enough OG tags for a good preview
  const hasOgTags = Boolean(seoData.ogTitle && seoData.ogDescription && seoData.ogImage);

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-500 mb-4">FACEBOOK SHARE PREVIEW</h3>
      <div className="preview-container rounded-lg overflow-hidden border border-gray-200">
        {imageUrl ? (
          <div className="h-52 bg-gray-200">
            <img 
              src={imageUrl} 
              alt="Open Graph preview" 
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
          <div className="text-xs text-gray-500 uppercase font-semibold">{hostname}</div>
          <div className="text-base font-medium mb-1">{truncateString(title, 90)}</div>
          <div className="text-sm text-gray-600">{truncateString(description, 200)}</div>
        </div>
      </div>
      <div className="mt-4 text-sm">
        <p className="font-medium flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Analysis
        </p>
        <ul className="mt-2 space-y-2 text-gray-600 pl-5 list-disc">
          <li>{seoData.ogTitle ? 'Open Graph title is present and accurate' : 'Open Graph title is missing'}</li>
          <li>{seoData.ogDescription ? 'OG description is properly set' : 'OG description is missing'}</li>
          <li>{seoData.ogImage ? 'OG image is present with good dimensions (1200×630px recommended)' : 'OG image is missing'}</li>
          <li>{seoData.ogType ? `OG type is set to "${seoData.ogType}"` : 'OG type is missing (recommend setting to "website" for homepage)'}</li>
        </ul>
      </div>
    </div>
  );
}
