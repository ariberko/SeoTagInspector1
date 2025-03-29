import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { SEOMetaTag } from '@shared/schema';
import GooglePreview from './GooglePreview';
import FacebookPreview from './FacebookPreview';
import TwitterPreview from './TwitterPreview';

interface PreviewSectionProps {
  seoData: SEOMetaTag;
}

type PreviewTab = 'google' | 'facebook' | 'twitter';

export default function PreviewSection({ seoData }: PreviewSectionProps) {
  const [activeTab, setActiveTab] = useState<PreviewTab>('google');

  return (
    <section className="mb-8">
      <Card className="overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button 
              onClick={() => setActiveTab('google')}
              className={`px-6 py-4 font-medium text-sm border-b-2 focus:outline-none ${
                activeTab === 'google' 
                  ? 'text-primary border-primary' 
                  : 'text-gray-500 hover:text-gray-700 border-transparent hover:border-gray-300'
              }`}
            >
              Google Preview
            </button>
            <button 
              onClick={() => setActiveTab('facebook')}
              className={`px-6 py-4 font-medium text-sm border-b-2 focus:outline-none ${
                activeTab === 'facebook' 
                  ? 'text-primary border-primary' 
                  : 'text-gray-500 hover:text-gray-700 border-transparent hover:border-gray-300'
              }`}
            >
              Facebook Preview
            </button>
            <button 
              onClick={() => setActiveTab('twitter')}
              className={`px-6 py-4 font-medium text-sm border-b-2 focus:outline-none ${
                activeTab === 'twitter' 
                  ? 'text-primary border-primary' 
                  : 'text-gray-500 hover:text-gray-700 border-transparent hover:border-gray-300'
              }`}
            >
              Twitter Preview
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'google' && <GooglePreview seoData={seoData} />}
          {activeTab === 'facebook' && <FacebookPreview seoData={seoData} />}
          {activeTab === 'twitter' && <TwitterPreview seoData={seoData} />}
        </div>
      </Card>
    </section>
  );
}
