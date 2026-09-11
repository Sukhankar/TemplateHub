import Template from "../models/Template.js";

// GET /sitemap.xml
export const getSitemapXML = async (req, res) => {
  try {
    const templates = await Template.find({ status: "approved" }).select("_id updatedAt");
    const baseUrl = process.env.FRONTEND_URL || "https://templatehub.com";

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static pages
    const staticPages = ["", "/templates", "/about", "/contact", "/login", "/register"];
    staticPages.forEach((page) => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}${page}</loc>\n`;
      xml += `    <changefreq>daily</changefreq>\n`;
      xml += `    <priority>${page === "" ? "1.0" : "0.8"}</priority>\n`;
      xml += `  </url>\n`;
    });

    // Dynamic template pages
    templates.forEach((tpl) => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/template/${tpl._id}</loc>\n`;
      xml += `    <lastmod>${tpl.updatedAt ? new Date(tpl.updatedAt).toISOString() : new Date().toISOString()}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.9</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += `</urlset>`;

    res.header("Content-Type", "application/xml");
    res.status(200).send(xml);
  } catch (error) {
    console.error("❌ Sitemap generation error:", error);
    res.status(500).send("Error generating sitemap");
  }
};

// GET /robots.txt
export const getRobotsTXT = (req, res) => {
  const baseUrl = process.env.FRONTEND_URL || "https://templatehub.com";
  const robots = `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /developer/\nDisallow: /api/\n\nSitemap: ${baseUrl}/sitemap.xml\n`;
  res.header("Content-Type", "text/plain");
  res.status(200).send(robots);
};

// GET /api/seo/schema/template/:id
export const getTemplateSchema = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) return res.status(404).json({ message: "Template not found" });

    const baseUrl = process.env.FRONTEND_URL || "https://templatehub.com";

    const schema = {
      "@context": "https://schema.org/",
      "@type": "Product",
      name: template.title,
      image: template.previewImages || [template.image],
      description: template.description,
      sku: template._id,
      category: template.category,
      offers: {
        "@type": "Offer",
        url: `${baseUrl}/template/${template._id}`,
        priceCurrency: "USD",
        price: template.isFree ? "0.00" : template.price,
        itemCondition: "https://schema.org/NewCondition",
        availability: "https://schema.org/InStock",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: template.rating || 5.0,
        reviewCount: template.numReviews || 1,
      },
    };

    res.status(200).json(schema);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
