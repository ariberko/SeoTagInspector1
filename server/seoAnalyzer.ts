import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import { SEOMetaTag, Competitor } from '@shared/schema';
import { calculateSEOScore, calculateGrade, generateRecommendations } from '@/lib/seoUtils';

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
      
      // Calculate content length
      const contentLength = $('body').text().trim().length;
      seoData.contentLength = contentLength;
      
      // Calculate the overall SEO score
      const score = calculateSEOScore(seoData);
      
      // Calculate grade from score
      const grade = calculateGrade(score);
      
      // Generate recommendations
      const recommendations = generateRecommendations(seoData);
      
      // Generate sample competitors based on the domain
      const competitors = this.getCompetitorsByDomain(url, score);
      
      return {
        ...seoData,
        score,
        grade,
        contentLength,
        competitors,
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

  private getCompetitorsByDomain(url: string, currentScore: number): Competitor[] {
    try {
      const domain = new URL(url).hostname.replace('www.', '');
      
      // Popular websites by industry
      const competitors: {[key: string]: Competitor[]} = {
        // Social Media
        'linkedin.com': [
          {
            url: 'https://www.glassdoor.com',
            title: 'Glassdoor - Job & Company Reviews',
            score: Math.min(95, currentScore + 15),
            strengths: [
              'Strong meta title optimization',
              'Complete social media tags',
              'Mobile-friendly design',
              'Comprehensive job listings schema'
            ]
          },
          {
            url: 'https://www.indeed.com',
            title: 'Indeed - Job Search Engine',
            score: Math.min(92, currentScore + 12),
            strengths: [
              'Rich structured data markup',
              'Strong internal linking',
              'Fast page loading speed',
              'Well-optimized mobile experience'
            ]
          },
          {
            url: 'https://www.ziprecruiter.com',
            title: 'ZipRecruiter - Employment Marketplace',
            score: Math.min(90, currentScore + 10),
            strengths: [
              'Excellent keyword density',
              'High-quality backlinks',
              'Optimized image alt texts',
              'Clear site hierarchy'
            ]
          }
        ],
        // Tech
        'apple.com': [
          {
            url: 'https://www.samsung.com',
            title: 'Samsung - Electronics & Mobile Devices',
            score: Math.min(95, currentScore + 15),
            strengths: [
              'Comprehensive product schema markup',
              'Excellent image optimization',
              'Clean canonical implementation',
              'Multi-language SEO structure'
            ]
          },
          {
            url: 'https://www.microsoft.com',
            title: 'Microsoft - Software & Services',
            score: Math.min(92, currentScore + 12),
            strengths: [
              'Perfect heading structure',
              'Fast page loading speed',
              'Strong internal linking',
              'Optimized mobile experience'
            ]
          },
          {
            url: 'https://www.google.com',
            title: 'Google - Search & Services',
            score: Math.min(90, currentScore + 10),
            strengths: [
              'Minimalist, fast-loading pages',
              'Excellent accessibility',
              'Perfect mobile optimization',
              'Clear site architecture'
            ]
          }
        ],
        // Default competitors for all other domains
        'default': [
          {
            url: 'https://www.hubspot.com',
            title: 'HubSpot - Marketing & Sales Platform',
            score: Math.min(95, currentScore + 15),
            strengths: [
              'Strong meta title optimization',
              'Excellent heading structure',
              'Complete social media tags',
              'Faster page loading speed'
            ]
          },
          {
            url: 'https://www.wordpress.com',
            title: 'WordPress - Website Building Platform',
            score: Math.min(92, currentScore + 12),
            strengths: [
              'Rich structured data markup',
              'Comprehensive meta description',
              'Mobile-friendly design',
              'Strong internal linking'
            ]
          },
          {
            url: 'https://www.wix.com',
            title: 'Wix - Website Builder',
            score: Math.min(90, currentScore + 10),
            strengths: [
              'Perfect keyword density',
              'High-quality backlinks',
              'Optimized image alt texts',
              'Well-structured URL hierarchy'
            ]
          }
        ]
      };
      
      // Look for exact domain match first
      for (const key in competitors) {
        if (domain.includes(key)) {
          return competitors[key];
        }
      }
      
      // Return default competitors if no match found
      return competitors['default'] || [];
    } catch (e) {
      console.error('Error generating competitors:', e);
      // Return empty array as fallback
      return [];
    }
  }
}

export const seoAnalyzer = new SEOAnalyzer();
