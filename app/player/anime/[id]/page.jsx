import { headers } from "next/headers";
import PlayerAnime from "@/components/views/player/PlayerAnime";
import SeoHead from "@/components/seo/SeoHead";
import ThinContentFaq from "@/components/seo/ThinContentFaq";
import {
  getDomainConfig,
  getVideoObjectSchema,
  getBreadcrumbSchema,
  THIN_CONTENT_ROBOTS,
} from "@/utils/seo";

export async function generateMetadata({ params }) {
  const { id } = params;
  const headersList = headers();
  const host = headersList.get("host") || "";
  const domainConfig = getDomainConfig(host);

  const cleanTitle = id
    ? id
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    : "Anime";

  const pageTitle =
    domainConfig.id === "fmovies"
      ? `Watch ${cleanTitle} Anime Online Free Sub & Dub in HD | FMovies`
      : `Stream ${cleanTitle} Anime Episodes Free in HD | Netmirror`;

  const description = `Watch ${cleanTitle} anime episodes online free with English Subtitles and Dubbed in HD quality on ${domainConfig.brandName}. Fast streaming, no signup.`;

  return {
    title: pageTitle,
    description,
    robots: THIN_CONTENT_ROBOTS,
    alternates: {
      canonical: `${domainConfig.url}/player/anime/${id}`,
    },
    openGraph: {
      title: pageTitle,
      description,
      url: `${domainConfig.url}/player/anime/${id}`,
      siteName: domainConfig.siteName,
    },
  };
}

export default async function AnimePlayerPage({ params }) {
  const { id } = params;
  const headersList = headers();
  const host = headersList.get("host") || "";
  const domainConfig = getDomainConfig(host);

  const cleanTitle = id
    ? id
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    : "Anime";

  const videoSchema = getVideoObjectSchema({
    title: `${cleanTitle} Anime Episodes`,
    description: `Stream ${cleanTitle} anime series online free in HD on ${domainConfig.brandName}`,
    embedUrl: `${domainConfig.url}/player/anime/${id}`,
    domainConfig,
  });

  const breadcrumbs = getBreadcrumbSchema(
    [
      { name: "Home", url: "/" },
      { name: "Anime", url: "/explore/anime" },
      { name: cleanTitle, url: `/player/anime/${id}` },
    ],
    domainConfig
  );

  return (
    <>
      <SeoHead schemas={[videoSchema, breadcrumbs]} />
      <PlayerAnime params={params} />
      <ThinContentFaq
        title={cleanTitle}
        brandName={domainConfig.brandName}
        mediaType="anime"
      />
    </>
  );
}
