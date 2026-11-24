import { headers } from "next/headers";
import SearchResult from "@/components/views/searchResult/SearchResult";
import SeoHead from "@/components/seo/SeoHead";
import ThinContentFaq from "@/components/seo/ThinContentFaq";
import {
  getDomainConfig,
  getBreadcrumbSchema,
  THIN_CONTENT_ROBOTS,
} from "@/utils/seo";

export async function generateMetadata({ params }) {
  const { query } = params;
  const decodedQuery = decodeURIComponent(query || "");
  const headersList = headers();
  const host = headersList.get("host") || "";
  const domainConfig = getDomainConfig(host);

  const pageTitle =
    domainConfig.id === "fmovies"
      ? `Search results for "${decodedQuery}" - Watch Free on FMovies`
      : domainConfig.id === "yesmovies"
      ? `Search results for "${decodedQuery}" - Watch Free on YesMovies`
      : `Search "${decodedQuery}" - Stream Free Movies & Series | Netmirror`;

  const description = `Find and stream movies, TV shows, and series matching "${decodedQuery}" online for free in HD quality on ${domainConfig.brandName}.`;

  const canonicalUrl = `${domainConfig.url}/search/${encodeURIComponent(decodedQuery)}`;

  return {
    title: pageTitle,
    description,
    keywords: [
      decodedQuery,
      `${decodedQuery} watch online`,
      `${decodedQuery} free movie`,
      domainConfig.brandName,
      ...domainConfig.keywords,
    ],
    robots: THIN_CONTENT_ROBOTS,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description,
      url: canonicalUrl,
      siteName: domainConfig.siteName,
    },
  };
}

export default function SearchPage({ params }) {
  const { query } = params;
  const decodedQuery = decodeURIComponent(query || "");
  const headersList = headers();
  const host = headersList.get("host") || "";
  const domainConfig = getDomainConfig(host);

  const searchResultsSchema = {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    name: `Search results for "${decodedQuery}" on ${domainConfig.brandName}`,
    description: `Watch results for ${decodedQuery} on ${domainConfig.brandName}`,
    url: `${domainConfig.url}/search/${encodeURIComponent(decodedQuery)}`,
  };

  const breadcrumbs = getBreadcrumbSchema(
    [
      { name: "Home", url: "/" },
      { name: `Search: ${decodedQuery}`, url: `/search/${encodeURIComponent(decodedQuery)}` },
    ],
    domainConfig
  );

  return (
    <>
      <SeoHead schemas={[searchResultsSchema, breadcrumbs]} />
      <SearchResult params={params} />
      <ThinContentFaq
        title={`Search for "${decodedQuery}"`}
        brandName={domainConfig.brandName}
        mediaType="search"
      />
    </>
  );
}
