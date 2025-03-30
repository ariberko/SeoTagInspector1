import { useState } from 'react';
import UrlInput from './UrlInput';
import OverallScore from './OverallScore';
import PreviewSection from './PreviewSection';
import DetailedAnalysis from './DetailedAnalysis';
import Recommendations from './Recommendations';
import SummaryStats from './SummaryStats';
import CompetitorAnalysis from './CompetitorAnalysis';
import { useSEOAnalysis } from '@/hooks/useSEOAnalysis';
import { SEOMetaTag } from '@shared/schema';

export default function SEOAnalyzer() {
  const [url, setUrl] = useState<string>('');
  const { 
    analyzeSEO, 
    seoData, 
    isLoading, 
    error 
  } = useSEOAnalysis();

  const handleUrlSubmit = async (submittedUrl: string) => {
    setUrl(submittedUrl);
    await analyzeSEO(submittedUrl);
  };
  
  const handleRefresh = () => {
    if (url) {
      analyzeSEO(url);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <UrlInput 
        onSubmit={handleUrlSubmit} 
        isLoading={isLoading} 
        error={error} 
      />

      {seoData && (
        <div className="space-y-8">
          <OverallScore 
            url={url} 
            seoData={seoData}
            onRefresh={handleRefresh}
          />
          
          <SummaryStats seoData={seoData} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <PreviewSection seoData={seoData} />
            </div>
            <div className="lg:col-span-1 space-y-8">
              <DetailedAnalysis seoData={seoData} />
              <Recommendations recommendations={seoData.recommendations || []} />
            </div>
          </div>
          
          <CompetitorAnalysis url={url} seoData={seoData} />
          
          <div className="text-center text-xs text-gray-500 mt-12 pb-4 border-t pt-4">
            © {new Date().getFullYear()} SEO Tag Inspector. All rights reserved to Ari Berkowitz.
          </div>
        </div>
      )}
    </div>
  );
}
