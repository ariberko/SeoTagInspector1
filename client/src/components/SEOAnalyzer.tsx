import { useState } from 'react';
import UrlInput from './UrlInput';
import OverallScore from './OverallScore';
import PreviewSection from './PreviewSection';
import DetailedAnalysis from './DetailedAnalysis';
import Recommendations from './Recommendations';
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

  return (
    <>
      <UrlInput 
        onSubmit={handleUrlSubmit} 
        isLoading={isLoading} 
        error={error} 
      />

      {seoData && (
        <>
          <OverallScore 
            url={url} 
            seoData={seoData} 
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <PreviewSection seoData={seoData} />
            </div>
            <div className="lg:col-span-1">
              <DetailedAnalysis seoData={seoData} />
              <Recommendations recommendations={seoData.recommendations || []} />
            </div>
          </div>
        </>
      )}
    </>
  );
}
