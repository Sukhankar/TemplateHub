import { useEffect } from "react";

const SEO = ({
  title = "TemplateHub — Production Website Templates & Marketplace",
  description = "Browse, preview, and purchase premium HTML, React, and Tailwind CSS website templates built by top developers.",
  image = "/DevCanvasLogo.png",
  url = window.location.href,
}) => {
  useEffect(() => {
    // 1. Document Title
    document.title = title.includes("TemplateHub") ? title : `${title} | TemplateHub`;

    // Helper to update meta tag
    const updateMetaTag = (selector, attributeName, value, content) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attributeName, value);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // 2. Standard Meta Description
    updateMetaTag('meta[name="description"]', "name", "description", description);

    // 3. Open Graph Tags
    updateMetaTag('meta[property="og:title"]', "property", "og:title", title);
    updateMetaTag('meta[property="og:description"]', "property", "og:description", description);
    updateMetaTag('meta[property="og:image"]', "property", "og:image", image);
    updateMetaTag('meta[property="og:url"]', "property", "og:url", url);
    updateMetaTag('meta[property="og:type"]', "property", "og:type", "website");

    // 4. Twitter Card Meta Tags
    updateMetaTag('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    updateMetaTag('meta[name="twitter:title"]', "name", "twitter:title", title);
    updateMetaTag('meta[name="twitter:description"]', "name", "twitter:description", description);
    updateMetaTag('meta[name="twitter:image"]', "name", "twitter:image", image);
  }, [title, description, image, url]);

  return null;
};

export default SEO;
