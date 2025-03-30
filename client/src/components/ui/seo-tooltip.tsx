import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { HelpCircleIcon } from 'lucide-react';

interface SEOTooltipProps {
  term: string;
  children?: React.ReactNode;
  icon?: boolean;
  className?: string;
}

// Dictionary of SEO terms and their simple explanations
const seoTerms: Record<string, string> = {
  'meta title': 'The title of your page that appears in search engine results and browser tabs. An important SEO element.',
  'meta description': 'A brief summary of your page content that appears under the title in search results. Helps users decide whether to click on your page.',
  'canonical url': 'A tag that tells search engines which version of a page is the primary one, to avoid duplicate content issues.',
  'h1 tag': 'The main heading on your page. Each page should have exactly one H1 tag to properly indicate the main topic.',
  'h2 tag': 'Subheadings that organize your content into sections. Important for both users and search engines to understand your content structure.',
  'open graph': 'Tags that control how your content appears when shared on social media platforms like Facebook and Instagram.',
  'twitter card': 'Special tags that control how your content appears when shared on Twitter.',
  'seo score': 'A calculated score that represents how well your page is optimized for search engines based on various factors.',
  'alt text': 'Text descriptions added to images to help search engines understand what they contain and to assist visually impaired users.',
  'robots tag': 'Instructions for search engine crawlers about how to index and follow links on your page.',
  'keywords': 'Important terms related to your content that help define what your page is about.',
  'schema markup': 'Structured data code added to your HTML to help search engines better understand your content and provide rich results.',
  'mobile-friendly': 'How well your page works on mobile devices, which is a significant ranking factor for search engines.',
  'page speed': 'How quickly your page loads, which affects both user experience and search engine rankings.',
  'backlinks': 'Links from other websites to your page, which are considered votes of confidence by search engines.',
  'internal links': 'Links between pages on your own website, which help establish site structure and spread link equity.',
  'sitemap': 'A file that lists the pages of your website to help search engines discover and crawl them.',
  'rich snippets': 'Enhanced search results with additional information like ratings, prices, or other data.',
  'serp': 'Search Engine Results Page - what users see after entering a search query.',
  'crawlability': 'How easy it is for search engines to discover and index your website pages.',
  'google search': 'A preview of how your page appears in Google search results. Having optimized title and description can improve click-through rates.',
  'seo_score': 'A calculated metric that represents how well your page is optimized for search engines based on various SEO factors.',
};

export function SEOTooltip({ term, children, icon = true, className = '' }: SEOTooltipProps) {
  // Convert term to lowercase for case-insensitive matching
  const lowerTerm = term.toLowerCase();
  
  // Look for exact match first
  const explanation = seoTerms[lowerTerm] || 
    // Try to find partial matches if exact match not found
    Object.entries(seoTerms).find(([key]) => lowerTerm.includes(key) || key.includes(lowerTerm))?.[1] ||
    // Default message if no match found
    'A term related to Search Engine Optimization.';

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger className={`cursor-help inline-flex items-center ${className}`}>
          {children}
          {icon && <HelpCircleIcon className="ml-1 h-3 w-3 text-gray-400 inline" />}
        </TooltipTrigger>
        <TooltipContent className="max-w-xs p-3">
          <p className="text-sm">{explanation}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}