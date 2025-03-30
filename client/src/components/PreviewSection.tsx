import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SEOMetaTag } from '@shared/schema';
import GooglePreview from './GooglePreview';
import FacebookPreview from './FacebookPreview';
import TwitterPreview from './TwitterPreview';
import InstagramPreview from './InstagramPreview';
import { Search, Facebook, Twitter, Instagram, MonitorSmartphone, EyeIcon } from 'lucide-react';
import { SEOTooltip } from './ui/seo-tooltip';

interface PreviewSectionProps {
  seoData: SEOMetaTag;
}

export default function PreviewSection({ seoData }: PreviewSectionProps) {
  return (
    <section>
      <Card className="overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-border flex items-center">
          <EyeIcon className="h-5 w-5 text-primary mr-2" />
          <div className="flex items-center">
            <h3 className="font-medium text-lg">Preview Appearance</h3>
            <div className="ml-2">
              <SEOTooltip term="serp">
                <span></span>
              </SEOTooltip>
            </div>
          </div>
          <div className="ml-auto flex items-center">
            <MonitorSmartphone className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground ml-1">Cross-platform previews</span>
          </div>
        </div>
        
        <Tabs defaultValue="google" className="w-full">
          <div className="border-b border-border px-3 pt-2 bg-accent/30">
            <TabsList className="grid grid-cols-4 sm:max-w-2xl h-auto bg-transparent p-0 rounded-none">
              <TabsTrigger 
                value="google"
                className="flex items-center justify-center py-3 text-sm data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:rounded-none rounded-none hover:text-primary/80 transition-colors"
              >
                <Search className="h-4 w-4 mr-2" />
                <SEOTooltip term="google search" icon={false}>
                  <span className="hidden sm:inline">Google</span>
                  <span className="inline sm:hidden">Google</span>
                </SEOTooltip>
              </TabsTrigger>
              
              <TabsTrigger 
                value="facebook"
                className="flex items-center justify-center py-3 text-sm data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:rounded-none rounded-none hover:text-primary/80 transition-colors"
              >
                <Facebook className="h-4 w-4 mr-2" />
                <SEOTooltip term="open graph" icon={false}>
                  <span className="hidden sm:inline">Facebook</span>
                  <span className="inline sm:hidden">FB</span>
                </SEOTooltip>
              </TabsTrigger>
              
              <TabsTrigger 
                value="twitter"
                className="flex items-center justify-center py-3 text-sm data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:rounded-none rounded-none hover:text-primary/80 transition-colors"
              >
                <Twitter className="h-4 w-4 mr-2" />
                <SEOTooltip term="twitter card" icon={false}>
                  <span className="hidden sm:inline">Twitter</span>
                  <span className="inline sm:hidden">Twitter</span>
                </SEOTooltip>
              </TabsTrigger>
              
              <TabsTrigger 
                value="instagram"
                className="flex items-center justify-center py-3 text-sm data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:rounded-none rounded-none hover:text-primary/80 transition-colors"
              >
                <Instagram className="h-4 w-4 mr-2" />
                <SEOTooltip term="open graph" icon={false}>
                  <span className="hidden sm:inline">Instagram</span>
                  <span className="inline sm:hidden">IG</span>
                </SEOTooltip>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <CardContent className="p-6 sm:p-8">
            <TabsContent value="google" className="mt-0">
              <div className="bg-muted p-4 rounded-lg mb-4">
                <p className="text-sm text-foreground">
                  Google search results preview shows how your page appears in search engine results pages. This affects your click-through rate.
                </p>
              </div>
              <GooglePreview seoData={seoData} />
            </TabsContent>
            
            <TabsContent value="facebook" className="mt-0">
              <div className="bg-blue-950/10 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  Facebook uses Open Graph tags to determine how your content appears when shared on the platform. Complete OG tags improve engagement.
                </p>
              </div>
              <FacebookPreview seoData={seoData} />
            </TabsContent>
            
            <TabsContent value="twitter" className="mt-0">
              <div className="bg-sky-950/10 dark:bg-sky-900/20 p-4 rounded-lg mb-4">
                <p className="text-sm text-sky-700 dark:text-sky-400">
                  Twitter Card tags control how your content is displayed when shared on Twitter. Well-configured cards improve visibility and engagement.
                </p>
              </div>
              <TwitterPreview seoData={seoData} />
            </TabsContent>
            
            <TabsContent value="instagram" className="mt-0">
              <div className="bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-red-500/20 dark:from-purple-500/30 dark:via-pink-500/30 dark:to-red-500/30 p-4 rounded-lg mb-4">
                <p className="text-sm text-purple-900 dark:text-purple-300">
                  Instagram uses Open Graph tags for image shares. A properly configured og:image tag ensures your content looks great when shared.
                </p>
              </div>
              <InstagramPreview seoData={seoData} />
            </TabsContent>
          </CardContent>
        </Tabs>
        
        <div className="px-6 py-3 bg-accent/30 border-t border-border text-xs text-muted-foreground">
          Previews are approximate and may vary slightly from actual appearance on platforms.
        </div>
      </Card>
    </section>
  );
}
