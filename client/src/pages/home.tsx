import SEOAnalyzer from "@/components/SEOAnalyzer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" />
              </svg>
              <h1 className="text-xl font-bold text-gray-900">SEO Tag Inspector</h1>
            </div>
            <div>
              <a href="https://developers.google.com/search/docs/fundamentals/seo-starter-guide" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:text-primary-dark">Documentation</a>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <SEOAnalyzer />
      </main>

      <footer className="bg-gray-50 border-t border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-gray-500">
            <p>SEO Tag Inspector &copy; {new Date().getFullYear()}. All rights reserved.</p>
            <p className="mt-1">A tool for analyzing and improving your website's SEO meta tags.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
