export const truncateString = (str: string, maxLength: number): string => {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
};

export const calculateTitleStatus = (length: number): 'good' | 'warning' | 'error' => {
  if (length >= 40 && length <= 60) return 'good';
  if (length >= 30 && length < 40) return 'warning';
  if (length > 60 && length <= 70) return 'warning';
  return 'error';
};

export const calculateDescriptionStatus = (length: number): 'good' | 'warning' | 'error' => {
  if (length >= 140 && length <= 160) return 'good';
  if (length >= 100 && length < 140) return 'warning';
  if (length > 160 && length <= 180) return 'warning';
  return 'error';
};

export const calculateSEOScore = (seoData: any): number => {
  // Start with a perfect score and deduct points for issues
  let score = 100;
  
  // Title analysis
  if (!seoData.title) {
    score -= 20;
  } else {
    const titleLength = seoData.title.length;
    if (titleLength < 30 || titleLength > 70) {
      score -= 10;
    } else if (titleLength < 40 || titleLength > 60) {
      score -= 5;
    }
  }
  
  // Description analysis
  if (!seoData.description) {
    score -= 15;
  } else {
    const descLength = seoData.description.length;
    if (descLength < 80 || descLength > 180) {
      score -= 10;
    } else if (descLength < 140 || descLength > 160) {
      score -= 5;
    }
  }
  
  // Canonical URL analysis
  if (!seoData.canonical) {
    score -= 10;
  }
  
  // Heading tags analysis
  if (!seoData.h1 || seoData.h1.length === 0) {
    score -= 10;
  } else if (seoData.h1.length > 1) {
    score -= 5;
  }
  
  // Social tags analysis
  let missingOgTags = 0;
  if (!seoData.ogTitle) missingOgTags++;
  if (!seoData.ogDescription) missingOgTags++;
  if (!seoData.ogImage) missingOgTags++;
  
  if (missingOgTags === 3) {
    score -= 15; // Missing all OG tags is a bigger issue
  } else if (missingOgTags > 0) {
    score -= 5 * missingOgTags; // Deduct points for each missing OG tag
  }
  
  // Specifically check for Instagram-friendly image
  if (seoData.ogImage) {
    // No way to check image dimensions server-side without loading the image
    // But we can check if it exists at least
    score += 5;
  }
  
  if (!seoData.twitterCard || !seoData.twitterTitle) {
    score -= 10;
  }
  
  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(100, score));
};

export const generateRecommendations = (seoData: any) => {
  const recommendations = [];
  
  // Title recommendations
  if (!seoData.title) {
    recommendations.push({
      type: 'error',
      title: 'Add a title tag',
      description: 'Every page needs a unique, descriptive title tag optimized for search.'
    });
  } else if (seoData.title.length < 30) {
    recommendations.push({
      type: 'warning',
      title: 'Title tag is too short',
      description: 'Your title should be between 50-60 characters for optimal display in search results.'
    });
  } else if (seoData.title.length > 60) {
    recommendations.push({
      type: 'warning',
      title: 'Title tag is too long',
      description: 'Search engines typically display only the first 50-60 characters of a title.'
    });
  }
  
  // Description recommendations
  if (!seoData.description) {
    recommendations.push({
      type: 'error',
      title: 'Add a meta description',
      description: 'Meta descriptions help search engines understand the content of your page.'
    });
  } else if (seoData.description.length < 120) {
    recommendations.push({
      type: 'warning',
      title: 'Extend your meta description',
      description: 'Add more descriptive content to reach the ideal length of 150-160 characters.'
    });
  } else if (seoData.description.length > 160) {
    recommendations.push({
      type: 'warning',
      title: 'Shorten your meta description',
      description: 'Descriptions longer than 160 characters might get truncated in search results.'
    });
  }
  
  // Heading tags recommendations
  if (!seoData.h1 || seoData.h1.length === 0) {
    recommendations.push({
      type: 'error',
      title: 'Add an H1 heading',
      description: 'Every page should have exactly one H1 heading that describes the page content.'
    });
  } else if (seoData.h1.length > 1) {
    recommendations.push({
      type: 'warning',
      title: 'Too many H1 headings',
      description: 'Best practice is to have only one H1 heading per page.'
    });
  }
  
  // Social tags recommendations
  if (!seoData.ogTitle || !seoData.ogDescription || !seoData.ogImage) {
    recommendations.push({
      type: 'warning',
      title: 'Complete Open Graph meta tags',
      description: 'Adding Open Graph tags will improve how your content appears when shared on Facebook, Instagram, and other platforms.'
    });
  }
  
  // Instagram specific recommendation for image
  if (!seoData.ogImage) {
    recommendations.push({
      type: 'warning',
      title: 'Add og:image for Instagram sharing',
      description: 'Instagram relies on the og:image tag for shared links. Adding a square image (1:1 ratio) improves appearance.'
    });
  }
  
  if (!seoData.twitterCard || !seoData.twitterTitle) {
    recommendations.push({
      type: 'warning',
      title: 'Add Twitter Card meta tags',
      description: 'Implement Twitter Card tags to improve visibility when your content is shared on Twitter.'
    });
  }
  
  // Canonical URL recommendations
  if (!seoData.canonical) {
    recommendations.push({
      type: 'warning',
      title: 'Add a canonical URL',
      description: 'A canonical tag helps prevent duplicate content issues by specifying the preferred version of a page.'
    });
  }
  
  // If good heading structure, add a positive recommendation
  if (seoData.h1?.length === 1 && seoData.h2?.length > 0) {
    recommendations.push({
      type: 'success',
      title: 'Good heading structure',
      description: 'Your page has a clear H1 tag and a logical heading hierarchy, which helps with SEO ranking.'
    });
  }
  
  // If social media tags are well configured
  if (seoData.ogTitle && seoData.ogDescription && seoData.ogImage && 
      seoData.twitterCard && seoData.twitterTitle) {
    recommendations.push({
      type: 'success',
      title: 'Excellent social media optimization',
      description: 'Your page is well-optimized for sharing across Facebook, Instagram, Twitter, and other platforms.'
    });
  }
  
  return recommendations;
};
