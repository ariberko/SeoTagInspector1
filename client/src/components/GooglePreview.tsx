import { SEOMetaTag } from '@shared/schema';
import { truncateString } from '@/lib/seoUtils';

interface GooglePreviewProps {
  seoData: SEOMetaTag;
}

export default function GooglePreview({ seoData }: GooglePreviewProps) {
  // Get hostname from URL
  let hostname = '';
  try {
    const url = new URL(seoData.url);
    hostname = url.hostname;
  } catch (e) {
    hostname = seoData.url;
  }

  // Truncate title and description for Google search results
  const title = truncateString(seoData.title || 'No title found', 60);
  const description = truncateString(seoData.description || 'No description found', 160);
  
  // Format URL path for display
  const displayUrl = () => {
    try {
      const url = new URL(seoData.url);
      return `${url.hostname}${url.pathname}`;
    } catch {
      return seoData.url;
    }
  };

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-500 mb-4">GOOGLE SEARCH RESULT PREVIEW</h3>
      <div className="preview-container rounded-lg p-4 bg-white border border-gray-200">
        <div className="text-xl text-blue-700 hover:underline cursor-pointer mb-1">{title}</div>
        <div className="text-sm text-green-700 mb-1">{displayUrl()}</div>
        <div className="text-sm text-gray-600">{description}</div>
      </div>
      <div className="mt-4 text-sm">
        <p className="font-medium flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Analysis
        </p>
        <ul className="mt-2 space-y-2 text-gray-600 pl-5 list-disc">
          {seoData.title && (
            <li>
              Title length is {seoData.title.length <= 60 ? 'optimal' : 'too long'} ({seoData.title.length}/60 characters)
            </li>
          )}
          {seoData.description && (
            <li>
              Meta description length {seoData.description.length < 120 ? 'should be increased' : 'is good'} ({seoData.description.length}/160 characters)
            </li>
          )}
          <li>
            {seoData.canonical 
              ? 'Canonical URL is properly implemented' 
              : 'Consider adding a canonical URL tag to prevent duplicate content issues'}
          </li>
        </ul>
      </div>
    </div>
  );
}
