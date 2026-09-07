import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { products, productSlugs } from "@/content/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = site.url;
  
  // Static routes
  const routes = [
    "",
    "/about",
    "/contact",
    "/products",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Product routes
  const productRoutes = productSlugs.map((slug) => ({
    url: `${baseUrl}/products/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...routes, ...productRoutes];
}