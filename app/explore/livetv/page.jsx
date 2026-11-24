import { headers } from "next/headers";
import ExploreTv from "@/components/views/explore/ExploreTv";
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
      ? `Watch Live TV Channels Online Free | FMovies`
      : domainConfig.id === "yesmovies"
      ? `Watch Live TV Channels Online Free | YesMovies`
      : `Live TV Streaming - Watch Live Channels Online Free HD | Netmirror`;

  const description = `Stream live television channels for news, movies, entertainment, and sports online free in HD on ${domainConfig.brandName}.`;

  const canonicalUrl = `${domainConfig.url}/explore/livetv`;

  return {
    title: pageTitle,
    description,
    keywords: [
      "watch live tv online free",
      "live tv streaming",
      "free tv channels",
      "live television hd",
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

export default function ExploreTvPage() {
  const headersList = headers();
  const host = headersList.get("host") || "";
  const domainConfig = getDomainConfig(host);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Explore Live TV on ${domainConfig.brandName}`,
    description: `Watch live TV channels online free on ${domainConfig.brandName}`,
    url: `${domainConfig.url}/explore/livetv`,
  };

  const breadcrumbs = getBreadcrumbSchema(
    [
      { name: "Home", url: "/" },
      { name: "Explore Live TV", url: "/explore/livetv" },
    ],
    domainConfig
  );

  return (
    <>
      <SeoHead schemas={[collectionSchema, breadcrumbs]} />
      <ExploreTv />
      <ThinContentFaq
        title="Live TV Channels"
        brandName={domainConfig.brandName}
        mediaType="livetv"
      />
    </>
  );
}
