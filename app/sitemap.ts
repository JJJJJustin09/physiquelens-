import type { MetadataRoute } from "next";

const BASE_URL = "https://physiquelens.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/upload",
    "/questionnaire",
    "/processing",
    "/report",
    "/sample-report",
    "/privacy",
    "/how-it-works",
    "/checkout",
  ];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
