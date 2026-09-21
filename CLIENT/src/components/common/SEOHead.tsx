import { useEffect } from "react";

export interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  ogType?: string;
  ogImage?: string;
  canonicalUrl?: string;
  schemaData?: Record<string, any>;
}

export function SEOHead({
  title,
  description,
  keywords,
  ogType = "website",
  ogImage = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop",
  canonicalUrl,
  schemaData,
}: SEOHeadProps) {
  useEffect(() => {
    // 1. Update Title
    const formattedTitle = title.includes("RSIA") 
      ? title 
      : `${title} | RSIA Sayang Ibu Batusangkar`;
    document.title = formattedTitle;

    // Helper to set or create meta tag
    const setMetaTag = (attrName: "name" | "property", attrValue: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // 2. Set Meta Description & Keywords
    setMetaTag("name", "description", description);
    if (keywords) {
      setMetaTag("name", "keywords", keywords);
    }

    // 3. Set OpenGraph Meta Tags
    setMetaTag("property", "og:title", formattedTitle);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:type", ogType);
    setMetaTag("property", "og:image", ogImage);
    const pageUrl = canonicalUrl || (typeof window !== "undefined" ? window.location.href : "https://sayangibu.co.id");
    setMetaTag("property", "og:url", pageUrl);

    // 4. Set Twitter Cards
    setMetaTag("name", "twitter:title", formattedTitle);
    setMetaTag("name", "twitter:description", description);
    setMetaTag("name", "twitter:image", ogImage);

    // 5. Inject Structured Data (JSON-LD) if provided
    let scriptTag = document.getElementById("page-schema-jsonld");
    if (schemaData) {
      if (!scriptTag) {
        scriptTag = document.createElement("script");
        scriptTag.id = "page-schema-jsonld";
        scriptTag.setAttribute("type", "application/ld+json");
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schemaData);
    } else if (scriptTag) {
      scriptTag.remove();
    }

    return () => {
      // Optional cleanup on unmount
      const existingScript = document.getElementById("page-schema-jsonld");
      if (existingScript) existingScript.remove();
    };
  }, [title, description, keywords, ogType, ogImage, canonicalUrl, schemaData]);

  return null;
}
