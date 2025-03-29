import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import { SEOMetaTag } from '@shared/schema';
import { calculateSEOScore, generateRecommendations } from '@/lib/seoUtils';

class SEOAnalyzer {
  async analyzeSEO(url: string): Promise<SEOMetaTag> {
    try {
      // Ensure URL has protocol
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `https://${url}`;
      }
      
      // Fetch the HTML content
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SEOAnalyzerBot/1.0; +http://seotaginspector.com)'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
      }
      
      const html = await response.text();
      const $ = cheerio.load(html);
      
      // Extract meta tags and SEO elements
      const seoData: Partial<SEOMetaTag> = {
        url,
        title: $('title').text().trim(),
        description: $('meta[name="description"]').attr('content'),
        canonical: $('link[rel="canonical"]').attr('href'),
        h1: $('h1').map((_, el) => $(el).text().trim()).get(),
        h2: $('h2').map((_, el) => $(el).text().trim()).get(),
        h3: $('h3').map((_, el) => $(el).text().trim()).get(),
        ogTitle: $('meta[property="og:title"]').attr('content'),
        ogDescription: $('meta[property="og:description"]').attr('content'),
        ogImage: $('meta[property="og:image"]').attr('content'),
        ogUrl: $('meta[property="og:url"]').attr('content'),
        ogType: $('meta[property="og:type"]').attr('content'),
        ogSiteName: $('meta[property="og:site_name"]').attr('content'),
        twitterCard: $('meta[name="twitter:card"]').attr('content'),
        twitterSite: $('meta[name="twitter:site"]').attr('content'),
        twitterTitle: $('meta[name="twitter:title"]').attr('content'),
        twitterDescription: $('meta[name="twitter:description"]').attr('content'),
        twitterImage: $('meta[name="twitter:image"]').attr('content'),
        robots: $('meta[name="robots"]').attr('content'),
        keywords: $('meta[name="keywords"]').attr('content'),
        language: $('html').attr('lang'),
        favicon: this.extractFavicon($, url),
      };
      
      // Generate status checks
      const statusChecks: Record<string, { status: 'good' | 'warning' | 'error', message: string }> = {};
      
      // Title check
      if (!seoData.title) {
        statusChecks.title = { status: 'error', message: 'Missing title tag' };
      } else if (seoData.title.length < 30) {
        statusChecks.title = { status: 'warning', message: 'Title too short' };
      } else if (seoData.title.length > 60) {
        statusChecks.title = { status: 'warning', message: 'Title too long' };
      } else {
        statusChecks.title = { status: 'good', message: `Good length (${seoData.title.length} chars)` };
      }
      
      // Description check
      if (!seoData.description) {
        statusChecks.description = { status: 'error', message: 'Missing meta description' };
      } else if (seoData.description.length < 120) {
        statusChecks.description = { status: 'warning', message: `Too short (${seoData.description.length}/160 chars)` };
      } else if (seoData.description.length > 160) {
        statusChecks.description = { status: 'warning', message: `Too long (${seoData.description.length}/160 chars)` };
      } else {
        statusChecks.description = { status: 'good', message: `Good length (${seoData.description.length} chars)` };
      }
      
      // Canonical check
      if (!seoData.canonical) {
        statusChecks.canonical = { status: 'warning', message: 'Missing canonical URL' };
      } else {
        statusChecks.canonical = { status: 'good', message: 'Properly implemented' };
      }
      
      // Social tags check
      const hasOgTags = Boolean(seoData.ogTitle && seoData.ogDescription);
      const hasTwitterTags = Boolean(seoData.twitterCard && seoData.twitterTitle);
      
      if (hasOgTags && hasTwitterTags) {
        statusChecks.social = { status: 'good', message: 'All social tags present' };
      } else if (hasOgTags && !hasTwitterTags) {
        statusChecks.social = { status: 'warning', message: 'Missing Twitter cards' };
      } else if (!hasOgTags && hasTwitterTags) {
        statusChecks.social = { status: 'warning', message: 'Missing Open Graph tags' };
      } else {
        statusChecks.social = { status: 'error', message: 'Missing all social tags' };
      }
      
      // Calculate the overall SEO score
      const score = calculateSEOScore(seoData);
      
      // Generate recommendations
      const recommendations = generateRecommendations(seoData);
      
      return {
        ...seoData,
        score,
        statusChecks,
        recommendations
      } as SEOMetaTag;
    } catch (error) {
      console.error('Error analyzing SEO:', error);
      throw error;
    }
  }
  
  private extractFavicon($: cheerio.CheerioAPI, baseUrl: string): string {
    // Try to find favicon in different ways
    const faviconLink = $('link[rel="icon"]').attr('href') ||
                        $('link[rel="shortcut icon"]').attr('href') ||
                        $('link[rel="apple-touch-icon"]').attr('href');
    
    if (faviconLink) {
      // Handle relative URLs
      if (faviconLink.startsWith('/')) {
        try {
          const urlObj = new URL(baseUrl);
          return `${urlObj.protocol}//${urlObj.hostname}${faviconLink}`;
        } catch {
          return faviconLink;
        }
      }
      return faviconLink;
    }
    
    // Default favicon path if no link found
    try {
      const urlObj = new URL(baseUrl);
      return `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`;
    } catch {
      return '/favicon.ico';
    }
  }
}

export const seoAnalyzer = new SEOAnalyzer();
