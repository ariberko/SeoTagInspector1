import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Search, Globe, Loader2 } from 'lucide-react';

interface UrlInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
  error: Error | null;
}

export default function UrlInput({ onSubmit, isLoading, error }: UrlInputProps) {
  const [url, setUrl] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add https:// if not present
    let formattedUrl = url.trim();
    if (formattedUrl && !formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }
    
    onSubmit(formattedUrl);
  };

  return (
    <section className="mb-8">
      <Card className="shadow-md border-0">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-500 text-transparent bg-clip-text mb-1">
                SEO Tag Inspector
              </h2>
              <p className="text-muted-foreground text-sm">Analyze and optimize your website's SEO meta tags</p>
            </div>
            
            <div className="mt-3 sm:mt-0 hidden sm:flex items-center">
              <div className="flex space-x-1">
                <span className="w-3 h-3 bg-success rounded-full"></span>
                <span className="w-3 h-3 bg-warning rounded-full"></span>
                <span className="w-3 h-3 bg-error rounded-full"></span>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Globe className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input 
                type="url" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-10 pr-3 py-6 border-2 bg-background text-foreground focus:border-primary transition-colors"
                placeholder="https://example.com" 
                required
              />
            </div>
            <Button 
              type="submit" 
              className="inline-flex items-center justify-center py-6 px-6 text-base"
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5 mr-2" />
                  Analyze
                </>
              )}
            </Button>
          </form>

          {isLoading && (
            <div className="mt-6 bg-primary/5 rounded-lg p-4 border border-primary/20">
              <div className="flex items-center">
                <div className="mr-3">
                  <Loader2 className="animate-spin h-5 w-5 text-primary" />
                </div>
                <div>
                  <span className="text-sm font-medium">Analyzing SEO tags for the website...</span>
                  <p className="text-xs text-muted-foreground mt-1">This may take a few seconds depending on the website size</p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 bg-error-light p-4 rounded-lg border border-error/30">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-error flex-shrink-0 mr-3" />
                <div>
                  <span className="text-sm font-medium text-error">Analysis Failed</span>
                  <p className="text-sm mt-1">{error.message || "Unable to fetch the URL. Please check your internet connection or try a different URL."}</p>
                </div>
              </div>
            </div>
          )}
          
          {!isLoading && !error && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-success-light flex items-center justify-center mr-3">
                  <Search className="h-4 w-4 text-success" />
                </div>
                <span>Get search engine previews</span>
              </div>
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-warning-light flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span>Check SEO best practices</span>
              </div>
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-error-light flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span>Identify issues to fix</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
