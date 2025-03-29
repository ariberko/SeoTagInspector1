import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { SEOMetaTag } from '@shared/schema';

export const useSEOAnalysis = () => {
  const [seoData, setSeoData] = useState<SEOMetaTag | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const analyzeSEO = async (url: string) => {
    if (!url) {
      setError(new Error('Please enter a valid URL'));
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await apiRequest('POST', '/api/analyze-seo', { url });
      const data = await response.json();
      
      setSeoData(data);
      
      toast({
        title: "Analysis Complete",
        description: "The SEO analysis has been successfully completed.",
      });
    } catch (err) {
      console.error('Error analyzing SEO:', err);
      setError(err instanceof Error ? err : new Error('Failed to analyze the URL. Please try again.'));
      
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: err instanceof Error ? err.message : 'Failed to analyze the URL. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    seoData,
    isLoading,
    error,
    analyzeSEO
  };
};
