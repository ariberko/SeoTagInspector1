import { SEOMetaTag } from '@shared/schema';
import { truncateString } from '@/lib/seoUtils';
import { Instagram, Heart, MessageCircle, Send, Bookmark, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface InstagramPreviewProps {
  seoData: SEOMetaTag;
}

export default function InstagramPreview({ seoData }: InstagramPreviewProps) {
  // Get image URL from OG Image or placeholder
  const imageUrl = seoData.ogImage || 'https://via.placeholder.com/600x600/f5f5f5/999999?text=No+Image';
  
  // Get display name from URL
  const getDisplayName = () => {
    try {
      const url = new URL(seoData.url);
      const hostname = url.hostname.startsWith('www.') ? url.hostname.substring(4) : url.hostname;
      return hostname.split('.')[0]; // Just get the first part of the domain
    } catch {
      return 'username';
    }
  };
  
  // Truncate title for caption
  const caption = truncateString(seoData.title || 'No title found', 100);
  
  // Determine if we have proper social media tags
  const hasProperTags = Boolean(seoData.ogTitle && seoData.ogDescription && seoData.ogImage);

  return (
    <div>
      <div className="instagram-preview max-w-md mx-auto">
        {/* Instagram header */}
        <div className="bg-white rounded-t-lg border border-gray-300 border-b-0 p-3">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600"></div>
            <div className="ml-3">
              <span className="font-semibold text-sm">{getDisplayName()}</span>
              <span className="text-gray-500 text-xs ml-1">• Original</span>
            </div>
            <div className="ml-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Instagram image */}
        <div className="aspect-square border border-gray-300 border-b-0 overflow-hidden flex items-center justify-center bg-black">
          <img 
            src={imageUrl} 
            alt="Instagram preview" 
            className="w-full h-full object-cover" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x600/f5f5f5/999999?text=No+Image';
            }}
          />
        </div>

        {/* Instagram actions */}
        <div className="bg-white p-3 border border-gray-300 border-b-0">
          <div className="flex items-center">
            <Heart className="h-6 w-6 mr-3" />
            <MessageCircle className="h-6 w-6 mr-3" />
            <Send className="h-6 w-6" />
            <Bookmark className="h-6 w-6 ml-auto" />
          </div>
          <div className="mt-2">
            <span className="font-semibold text-sm">123 likes</span>
          </div>
        </div>

        {/* Instagram caption */}
        <div className="bg-white p-3 border border-gray-300 rounded-b-lg">
          <p className="text-sm">
            <span className="font-semibold">{getDisplayName()}</span> {caption}
          </p>
          <p className="text-gray-500 text-xs mt-1">View all 24 comments</p>
          <p className="text-gray-400 text-xs mt-1">2 HOURS AGO</p>
        </div>
        
        {/* Analysis section */}
        <div className="mt-8 bg-white rounded-lg p-4 border border-gray-300 shadow-sm">
          <div className="flex items-center mb-4">
            <Instagram className="h-5 w-5 text-primary mr-2" />
            <h4 className="font-medium text-base">Instagram Sharing Analysis</h4>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start p-3 bg-gray-50 rounded-md">
              <div className="mr-3 mt-0.5">
                {hasProperTags ? (
                  <CheckCircle className="h-4 w-4 text-success" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-warning" />
                )}
              </div>
              <div>
                <span className={`font-semibold ${hasProperTags ? 'text-success' : 'text-warning'}`}>
                  {hasProperTags ? 'Social sharing tags are properly configured' : 'Missing important social tags'}
                </span>
                <p className="text-sm text-gray-600 mt-1">
                  {hasProperTags 
                    ? 'Your site has properly configured Open Graph tags for optimal Instagram sharing' 
                    : 'Add og:title, og:description, and og:image tags for better Instagram sharing'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-3 bg-gray-50 rounded-md">
              <div className="mr-3 mt-0.5">
                <Info className="h-4 w-4 text-gray-500" />
              </div>
              <div>
                <span className="font-semibold">Instagram sharing best practices</span>
                <ul className="text-sm text-gray-600 mt-1 space-y-1 list-disc pl-4">
                  <li>Use high-quality square images (1:1 ratio)</li>
                  <li>Include engaging, concise copy in your og:description</li>
                  <li>Add relevant hashtags to increase discoverability</li>
                  <li>Instagram works best with visual content that tells a story</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}