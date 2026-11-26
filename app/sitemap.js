import { headers } from "next/headers";
import { getDomainConfig } from "@/utils/seo";
import { fetchDataFromApi } from "@/utils/api";

export const revalidate = 3600; // Cache sitemap for 1 hour for fast, stable crawler delivery

export default async function sitemap() {
  const headersList = headers();
  const host = headersList.get("host") || "";
  const domainConfig = getDomainConfig(host);
  const baseUrl = domainConfig.url;
  const today = new Date().toISOString().split("T")[0];

  // Base static discovery routes
  const staticRoutes = [
    {
      url: `${baseUrl}/`,
      lastModified: today,
      changeFrequency: "hourly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/explore/movie`,
      lastModified: today,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/explore/tv`,
      lastModified: today,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/explore/anime`,
      lastModified: today,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/explore/livetv`,
      lastModified: today,
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  try {
    const [trendingMovies, trendingTv] = await Promise.all([
      fetchDataFromApi("/trending/movie/week").catch(() => null),
      fetchDataFromApi("/trending/tv/week").catch(() => null),
    ]);

    const dynamicRoutes = [];

    if (trendingMovies?.results?.length) {
      trendingMovies.results.slice(0, 30).forEach((item) => {
        const itemDate = item.release_date || today;
        dynamicRoutes.push({
          url: `${baseUrl}/movie/${item.id}`,
          lastModified: itemDate,
          changeFrequency: "weekly",
          priority: 0.8,
        });
        dynamicRoutes.push({
          url: `${baseUrl}/player/movie/${item.id}`,
          lastModified: itemDate,
          changeFrequency: "weekly",
          priority: 0.7,
        });
      });
    }

    if (trendingTv?.results?.length) {
      trendingTv.results.slice(0, 30).forEach((item) => {
        const itemDate = item.first_air_date || today;
        dynamicRoutes.push({
          url: `${baseUrl}/tv/${item.id}`,
          lastModified: itemDate,
          changeFrequency: "weekly",
          priority: 0.8,
        });
        dynamicRoutes.push({
          url: `${baseUrl}/player/tv/${item.id}`,
          lastModified: itemDate,
          changeFrequency: "weekly",
          priority: 0.7,
        });
      });
    }

    return [...staticRoutes, ...dynamicRoutes];
  } catch (err) {
    console.error("Error generating dynamic sitemap routes:", err);
    return staticRoutes;
  }
}
