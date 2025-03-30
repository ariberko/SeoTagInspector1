import { SEOMetaTag } from '@shared/schema';
import { truncateString } from '@/lib/seoUtils';
import { AlertCircle, CheckCircle, Search, Info } from 'lucide-react';

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
      const hostname = url.hostname.startsWith('www.') ? url.hostname.substring(4) : url.hostname;
      return `${hostname}${url.pathname}`;
    } catch {
      return seoData.url;
    }
  };
  
  // Get title status
  const getTitleStatus = () => {
    if (!seoData.title) {
      return { icon: <AlertCircle className="h-4 w-4 text-error" />, text: 'Title tag is missing', color: 'text-error' };
    }
    const titleLength = seoData.title.length;
    if (titleLength < 30) {
      return { icon: <AlertCircle className="h-4 w-4 text-warning" />, text: 'Title is too short', color: 'text-warning' };
    }
    if (titleLength > 60) {
      return { icon: <AlertCircle className="h-4 w-4 text-warning" />, text: 'Title is too long', color: 'text-warning' };
    }
    return { icon: <CheckCircle className="h-4 w-4 text-success" />, text: 'Title length is optimal', color: 'text-success' };
  };
  
  // Get description status
  const getDescriptionStatus = () => {
    if (!seoData.description) {
      return { icon: <AlertCircle className="h-4 w-4 text-error" />, text: 'Meta description is missing', color: 'text-error' };
    }
    const descLength = seoData.description.length;
    if (descLength < 120) {
      return { icon: <AlertCircle className="h-4 w-4 text-warning" />, text: 'Description is too short', color: 'text-warning' };
    }
    if (descLength > 160) {
      return { icon: <AlertCircle className="h-4 w-4 text-warning" />, text: 'Description is too long', color: 'text-warning' };
    }
    return { icon: <CheckCircle className="h-4 w-4 text-success" />, text: 'Description length is optimal', color: 'text-success' };
  };
  
  const titleStatus = getTitleStatus();
  const descriptionStatus = getDescriptionStatus();

  return (
    <div>
      <div className="preview-container max-w-3xl mx-auto">
        {/* Google search bar */}
        <div className="bg-white rounded-t-lg border border-gray-300 p-3 mb-3 shadow-sm">
          <div className="flex items-center">
            <div className="w-24 flex justify-center mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="74" height="24" viewBox="0 0 74 24">
                <path fill="#4285F4" d="M9.24 8.19v2.46h5.88c-.18 1.38-.64 2.39-1.34 3.1-.86.86-2.2 1.8-4.54 1.8-3.62 0-6.45-2.92-6.45-6.54s2.83-6.54 6.45-6.54c1.95 0 3.38.77 4.43 1.76L15.4 2.5C13.94 1.08 11.98 0 9.24 0 4.28 0 .11 4.04.11 9s4.17 9 9.13 9c2.68 0 4.7-.88 6.28-2.52 1.62-1.62 2.13-3.91 2.13-5.75 0-.57-.04-1.1-.13-1.54H9.24z"/>
                <path fill="#EA4335" d="M25 6.19c-3.21 0-5.83 2.44-5.83 5.81 0 3.34 2.62 5.81 5.83 5.81s5.83-2.46 5.83-5.81c0-3.37-2.62-5.81-5.83-5.81zm0 9.33c-1.76 0-3.28-1.45-3.28-3.52 0-2.09 1.52-3.52 3.28-3.52s3.28 1.43 3.28 3.52c0 2.07-1.52 3.52-3.28 3.52z"/>
                <path fill="#FBBC05" d="M53.58 7.49h-.09c-.57-.68-1.67-1.3-3.06-1.3C47.53 6.19 45 8.72 45 12c0 3.26 2.53 5.81 5.43 5.81 1.39 0 2.49-.62 3.06-1.32h.09v.81c0 2.22-1.19 3.41-3.1 3.41-1.56 0-2.53-1.12-2.93-2.07l-2.22.92c.64 1.54 2.33 3.43 5.15 3.43 2.99 0 5.52-1.76 5.52-6.05V6.49h-2.42v1zm-2.93 8.03c-1.76 0-3.1-1.5-3.1-3.52 0-2.05 1.34-3.52 3.1-3.52 1.74 0 3.1 1.5 3.1 3.54.01 2.03-1.36 3.5-3.1 3.5z"/>
                <path fill="#4285F4" d="M38 6.19c-3.21 0-5.83 2.44-5.83 5.81 0 3.34 2.62 5.81 5.83 5.81s5.83-2.46 5.83-5.81c0-3.37-2.62-5.81-5.83-5.81zm0 9.33c-1.76 0-3.28-1.45-3.28-3.52 0-2.09 1.52-3.52 3.28-3.52s3.28 1.43 3.28 3.52c0 2.07-1.52 3.52-3.28 3.52z"/>
                <path fill="#34A853" d="M58 .24h2.51v17.57H58z"/>
                <path fill="#EA4335" d="M68.26 15.52c-1.3 0-2.22-.59-2.82-1.76l7.77-3.21-.26-.66c-.48-1.3-1.96-3.7-4.97-3.7-2.99 0-5.48 2.35-5.48 5.81 0 3.26 2.46 5.81 5.76 5.81 2.66 0 4.2-1.63 4.84-2.57l-1.98-1.32c-.66.96-1.56 1.6-2.86 1.6zm-.18-7.15c1.03 0 1.91.53 2.2 1.28l-5.25 2.17c0-2.44 1.73-3.45 3.05-3.45z"/>
              </svg>
            </div>
            <div className="flex-grow">
              <div className="flex items-center bg-white border rounded-full px-4 py-2 shadow-sm">
                <Search className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-800 text-sm">{displayUrl()}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Search result */}
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">
            {displayUrl()}
          </div>
          <a href="#" className="block text-xl text-[#1a0dab] hover:underline mb-1 font-medium">
            {title}
          </a>
          <div className="text-sm text-[#4d5156] leading-normal">
            {description}
          </div>
        </div>
        
        {/* Analysis section */}
        <div className="mt-8 bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center mb-4">
            <Info className="h-5 w-5 text-primary mr-2" />
            <h4 className="font-medium text-base">Google Search Result Analysis</h4>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start p-3 bg-gray-50 rounded-md">
              <div className="mr-3 mt-0.5">
                {titleStatus.icon}
              </div>
              <div>
                <span className={`font-semibold ${titleStatus.color}`}>{titleStatus.text}</span>
                <p className="text-sm text-gray-600 mt-1">
                  Current length: {seoData.title?.length || 0}/60 characters
                  {seoData.title && seoData.title.length > 60 && (
                    <span className="block mt-1 text-orange-600">Google may truncate your title in search results</span>
                  )}
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-3 bg-gray-50 rounded-md">
              <div className="mr-3 mt-0.5">
                {descriptionStatus.icon}
              </div>
              <div>
                <span className={`font-semibold ${descriptionStatus.color}`}>{descriptionStatus.text}</span>
                <p className="text-sm text-gray-600 mt-1">
                  Current length: {seoData.description?.length || 0}/160 characters
                  {seoData.description && seoData.description.length > 160 && (
                    <span className="block mt-1 text-orange-600">Google may truncate your description in search results</span>
                  )}
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-3 bg-gray-50 rounded-md">
              <div className="mr-3 mt-0.5">
                {seoData.canonical ? (
                  <CheckCircle className="h-4 w-4 text-success" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-warning" />
                )}
              </div>
              <div>
                <span className={`font-semibold ${seoData.canonical ? 'text-success' : 'text-warning'}`}>
                  {seoData.canonical ? 'Canonical URL is properly implemented' : 'Canonical URL is missing'}
                </span>
                <p className="text-sm text-gray-600 mt-1">
                  {seoData.canonical 
                    ? 'A canonical URL helps prevent duplicate content issues' 
                    : 'Without a canonical tag, search engines may index duplicate versions of your page'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
