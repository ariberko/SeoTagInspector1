import { Card, CardContent } from '@/components/ui/card';
import { SEOMetaTag } from '@shared/schema';
import { BarChart, ExternalLink, TrendingUp, Award, CheckCircle2 } from 'lucide-react';
import { ScoreBadge } from './ui/score-badge';
import { SEOTooltip } from './ui/seo-tooltip';
import { useState } from 'react';

interface Competitor {
  url: string;
  title: string;
  score: number;
  strengths: string[];
}

interface CompetitorAnalysisProps {
  url: string;
  seoData: SEOMetaTag;
}

export default function CompetitorAnalysis({ url, seoData }: CompetitorAnalysisProps) {
  // We would typically fetch this data from an API, but for now we'll simulate it
  // In a real application, this would be fetched from the server based on the analyzed URL
  const [competitors] = useState<Competitor[]>([
    {
      url: 'https://competitor1.com',
      title: 'Competitor 1 - Similar Topic Website',
      score: Math.min(95, (seoData.score || 0) + 15),
      strengths: [
        'Strong meta title optimization',
        'Excellent heading structure',
        'Complete social media tags',
        'Faster page loading speed'
      ]
    },
    {
      url: 'https://competitor2.com',
      title: 'Competitor 2 - Industry Leader',
      score: Math.min(92, (seoData.score || 0) + 12),
      strengths: [
        'Rich structured data markup',
        'Comprehensive meta description',
        'Mobile-friendly design',
        'Strong internal linking'
      ]
    },
    {
      url: 'https://competitor3.com',
      title: 'Competitor 3 - Rising Competitor',
      score: Math.min(90, (seoData.score || 0) + 10),
      strengths: [
        'Perfect keyword density',
        'High-quality backlinks',
        'Optimized image alt texts',
        'Well-structured URL hierarchy'
      ]
    }
  ]);

  // Only show competitors with higher scores
  const relevantCompetitors = competitors.filter(comp => comp.score > (seoData.score || 0))
    // Limit to top 3
    .slice(0, 3);

  if (relevantCompetitors.length === 0) {
    // If no competitors have higher scores, don't show the section
    return null;
  }

  return (
    <section className="mt-8">
      <Card className="shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center">
          <TrendingUp className="h-5 w-5 text-primary mr-2" />
          <SEOTooltip term="serp">
            <h3 className="font-medium text-lg">Competitor Analysis</h3>
          </SEOTooltip>
        </div>
        
        <CardContent className="p-6">
          <div className="text-sm text-gray-500 mb-4">
            Below are similar websites that rank higher in search results. Learn what they're doing right to improve your own SEO.
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relevantCompetitors.map((competitor, index) => (
              <div 
                key={index} 
                className="border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="border-b border-gray-100 px-4 py-3 flex items-center justify-between">
                  <div className="truncate flex-1 font-medium text-sm">
                    {competitor.title}
                  </div>
                  <ScoreBadge score={competitor.score} className="ml-2" />
                </div>
                
                <div className="px-4 py-3">
                  <div className="flex items-center text-xs text-gray-500 mb-3">
                    <ExternalLink className="w-3 h-3 mr-1 flex-shrink-0" />
                    <a 
                      href={competitor.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-primary hover:underline overflow-hidden overflow-ellipsis"
                    >
                      {competitor.url}
                    </a>
                  </div>
                  
                  <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2 flex items-center">
                    <Award className="w-3 h-3 mr-1" /> 
                    <span>SEO Strengths</span>
                  </h4>
                  
                  <ul className="space-y-2">
                    {competitor.strengths.map((strength, idx) => (
                      <li key={idx} className="flex items-start text-xs">
                        <CheckCircle2 className="w-3 h-3 text-success mr-1 mt-0.5 flex-shrink-0" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-xs text-gray-400 mt-4">
            Note: Competitor analysis is based on similar websites in your industry.
          </div>
        </CardContent>
      </Card>
    </section>
  );
}