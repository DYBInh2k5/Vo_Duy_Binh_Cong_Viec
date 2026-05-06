import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
}

export const useSEO = ({ title, description, keywords, image }: SEOProps) => {
  useEffect(() => {
    // Default title from index.html or a fallback
    const baseTitle = 'coDY Portfolio | AI Engineer & Designer';
    
    if (title) {
      document.title = `${title} | coDY Portfolio`;
    } else {
      document.title = baseTitle;
    }

    const updateMetaTag = (name: string, content: string, property: boolean = false) => {
      let element = document.querySelector(`meta[${property ? 'property' : 'name'}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(property ? 'property' : 'name', name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    if (description) {
      updateMetaTag('description', description);
      updateMetaTag('og:description', description, true);
      updateMetaTag('twitter:description', description);
    }

    if (keywords && keywords.length > 0) {
      updateMetaTag('keywords', keywords.join(', '));
    }

    if (image) {
      updateMetaTag('og:image', image, true);
      updateMetaTag('twitter:image', image);
    }

    if (title) {
      updateMetaTag('og:title', title, true);
      updateMetaTag('twitter:title', title);
    } else {
      updateMetaTag('og:title', baseTitle, true);
      updateMetaTag('twitter:title', baseTitle);
    }

    // Cleanup logic if needed (optional for many cases but good practice)
    return () => {
      // We don't necessarily want to remove the tags, 
      // but maybe reset to defaults if it's a global SPA
    };
  }, [title, description, keywords, image]);
};
