import { useState, useEffect } from 'react';
import UrlInput from './UrlInput';
import OverallScore from './OverallScore';
import PreviewSection from './PreviewSection';
import DetailedAnalysis from './DetailedAnalysis';
import Recommendations from './Recommendations';
import SummaryStats from './SummaryStats';
import CompetitorAnalysis from './CompetitorAnalysis';
import HistorySection from './HistorySection';
import TasksSection from './TasksSection';
import ExportSection from './ExportSection';
import { useSEOAnalysis } from '@/hooks/useSEOAnalysis';
import { SEOMetaTag } from '@shared/schema';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AreaChartIcon, 
  ClipboardListIcon, 
  DownloadIcon, 
  ArrowUpCircleIcon,
  ArrowDownCircleIcon
} from 'lucide-react';
import { Button } from './ui/button';

export default function SEOAnalyzer() {
  const [url, setUrl] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { 
    analyzeSEO, 
    seoData, 
    isLoading, 
    error 
  } = useSEOAnalysis();

  // Check for shared report in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reportData = params.get('report');
    
    if (reportData) {
      try {
        const decodedJson = decodeURIComponent(atob(reportData));
        const report = JSON.parse(decodedJson);
        
        if (report.url && report.data) {
          setUrl(report.url);
          // We're not calling analyzeSEO since we already have the data
        }
      } catch (error) {
        console.error('Error parsing shared report:', error);
      }
    }
  }, []);

  const handleUrlSubmit = async (submittedUrl: string) => {
    setUrl(submittedUrl);
    await analyzeSEO(submittedUrl);
  };
  
  const handleRefresh = () => {
    if (url) {
      analyzeSEO(url);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto px-4 py-8 relative">
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
          
          {/* Toggle button for advanced features */}
          <div className="flex justify-center py-6">
            <Button 
              variant="outline" 
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center"
            >
              {showAdvanced ? (
                <>
                  <ArrowUpCircleIcon className="mr-2 h-4 w-4" />
                  Hide Advanced Features
                </>
              ) : (
                <>
                  <ArrowDownCircleIcon className="mr-2 h-4 w-4" />
                  Show Advanced Features
                </>
              )}
            </Button>
          </div>
          
          {/* Advanced features section */}
          {showAdvanced && (
            <div className="pt-4">
              <Tabs defaultValue="history" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="history">
                    <AreaChartIcon className="mr-2 h-4 w-4" />
                    SEO History
                  </TabsTrigger>
                  <TabsTrigger value="tasks">
                    <ClipboardListIcon className="mr-2 h-4 w-4" />
                    Task Management
                  </TabsTrigger>
                  <TabsTrigger value="export">
                    <DownloadIcon className="mr-2 h-4 w-4" />
                    Export & Reports
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="history">
                  <HistorySection url={url} />
                </TabsContent>
                
                <TabsContent value="tasks">
                  <TasksSection url={url} seoData={seoData} />
                </TabsContent>
                
                <TabsContent value="export">
                  <ExportSection url={url} seoData={seoData} />
                </TabsContent>
              </Tabs>
            </div>
          )}
          
          <div className="text-center text-xs text-gray-500 mt-12 pb-4 border-t pt-4">
            © {new Date().getFullYear()} SEO Tag Inspector. All rights reserved to Ari Berkowitz.
          </div>
          
          {/* Scroll to top button */}
          <Button 
            onClick={scrollToTop} 
            size="icon" 
            className="fixed bottom-6 right-6 rounded-full shadow-md"
            aria-label="Scroll to top"
          >
            <ArrowUpCircleIcon className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
