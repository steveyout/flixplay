import { headers } from "next/headers";
import ExploreAnime from "@/components/views/explore/ExploreAnime";
import SeoHead from "@/components/seo/SeoHead";
import ThinContentFaq from "@/components/seo/ThinContentFaq";
import {
  getDomainConfig,
  getBreadcrumbSchema,
  THIN_CONTENT_ROBOTS,
} from "@/utils/seo";

export async function generateMetadata() {
  const headersList = headers();
  const host = headersList.get("host") || "";
  const domainConfig = getDomainConfig(host);

  const pageTitle =
    domainConfig.id === "fmovies"
      ? `Watch Anime Online Free in HD - English Subbed & Dubbed | FMovies`
      : `Explore Anime Series & Movies Online Free in HD | Netmirror`;

  const description = `Discover and stream thousands of trending and classic anime shows online for free in HD with English subtitles and dubbing on ${domainConfig.brandName}.`;

  const canonicalUrl = `${domainConfig.url}/explore/anime`;

  return {
    title: pageTitle,
    description,
    keywords: [
      "watch anime online free",
      "anime sub and dub",
      "stream anime hd",
      "free anime website",
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

export default function ExploreAnimePage() {
  const headersList = headers();
  const host = headersList.get("host") || "";
  const domainConfig = getDomainConfig(host);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Explore Anime on ${domainConfig.brandName}`,
    description: `Watch anime episodes online free on ${domainConfig.brandName}`,
    url: `${domainConfig.url}/explore/anime`,
  };

  const breadcrumbs = getBreadcrumbSchema(
    [
      { name: "Home", url: "/" },
      { name: "Explore Anime", url: "/explore/anime" },
    ],
    domainConfig
  );

  return (
    <>
      <SeoHead schemas={[collectionSchema, breadcrumbs]} />
      <ExploreAnime />
      <ThinContentFaq
        title="Anime Series & Movies"
        brandName={domainConfig.brandName}
        mediaType="anime"
      />
    </>
  );
}
