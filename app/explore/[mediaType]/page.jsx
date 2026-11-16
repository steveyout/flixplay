import { headers } from "next/headers";
import Explore from "@/components/views/explore/Explore";
import SeoHead from "@/components/seo/SeoHead";
import ThinContentFaq from "@/components/seo/ThinContentFaq";
import {
  getDomainConfig,
  getBreadcrumbSchema,
  THIN_CONTENT_ROBOTS,
} from "@/utils/seo";

export async function generateMetadata({ params }) {
  const { mediaType } = params;
  const headersList = headers();
  const host = headersList.get("host") || "";
  const domainConfig = getDomainConfig(host);

  const isTv = mediaType === "tv";
  const mediaLabel = isTv ? "TV Shows" : "Movies";

  const pageTitle =
    domainConfig.id === "fmovies"
      ? `Explore & Watch Free ${mediaLabel} Online in HD | FMovies`
      : `Browse ${mediaLabel} - Stream Free HD ${mediaLabel} Online | Netmirror`;

  const description = isTv
    ? `Browse thousands of popular and trending TV series and web shows in HD on ${domainConfig.brandName}. Watch full seasons online for free without subscription.`
    : `Explore top rated and new release movies online in HD on ${domainConfig.brandName}. Stream full movies free with multiple fast server links.`;

  const canonicalUrl = `${domainConfig.url}/explore/${mediaType}`;

  return {
    title: pageTitle,
    description,
    keywords: [
      `watch ${mediaLabel.toLowerCase()} online`,
      `free ${mediaLabel.toLowerCase()} hd`,
      `stream ${mediaLabel.toLowerCase()} free`,
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

export default function ExplorePage({ params }) {
  const { mediaType } = params;
  const headersList = headers();
  const host = headersList.get("host") || "";
  const domainConfig = getDomainConfig(host);
  const mediaLabel = mediaType === "tv" ? "TV Shows" : "Movies";

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Explore ${mediaLabel} on ${domainConfig.brandName}`,
    description: `Discover and watch ${mediaLabel} online in HD on ${domainConfig.brandName}`,
    url: `${domainConfig.url}/explore/${mediaType}`,
  };

  const breadcrumbs = getBreadcrumbSchema(
    [
      { name: "Home", url: "/" },
      { name: `Explore ${mediaLabel}`, url: `/explore/${mediaType}` },
    ],
    domainConfig
  );

  return (
    <>
      <SeoHead schemas={[collectionSchema, breadcrumbs]} />
      <Explore params={params} />
      <ThinContentFaq
        title={`Explore ${mediaLabel}`}
        brandName={domainConfig.brandName}
        mediaType={mediaType}
      />
    </>
  );
}
