import { headers } from "next/headers";
import Player from "@/components/views/player/Player";
import SeoHead from "@/components/seo/SeoHead";
import ThinContentFaq from "@/components/seo/ThinContentFaq";
import { fetchDataFromApi } from "@/utils/api";
import {
  getDomainConfig,
  getVideoObjectSchema,
  getBreadcrumbSchema,
  THIN_CONTENT_ROBOTS,
} from "@/utils/seo";

export async function generateMetadata({ params }) {
  const { mediaType, id, season, episode } = params;
  const headersList = headers();
  const host = headersList.get("host") || "";
  const domainConfig = getDomainConfig(host);

  try {
    const data = await fetchDataFromApi(`/${mediaType}/${id}`);
    const title = data?.name || data?.title || "TV Show";

    const pageTitle =
      domainConfig.id === "fmovies"
        ? `Watch ${title} Season ${season} Episode ${episode} Online Free | FMovies`
        : `Stream ${title} S${season} E${episode} Full HD Free | Netmirror`;

    const description = `Watch ${title} Season ${season} Episode ${episode} online free in HD quality. Stream full episodes without registration on ${domainConfig.brandName}.`;

    const canonicalUrl = `${domainConfig.url}/player/${mediaType}/${id}/${season}/${episode}`;

    return {
      title: pageTitle,
      description,
      robots: THIN_CONTENT_ROBOTS,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: pageTitle,
        description,
        url: canonicalUrl,
        siteName: domainConfig.siteName,
        images: [
          {
            url: data?.backdrop_path
              ? `https://image.tmdb.org/t/p/w1280${data.backdrop_path}`
              : domainConfig.ogImage,
          },
        ],
      },
    };
  } catch (e) {
    return {
      title: `Watch Episode Online Free | ${domainConfig.brandName}`,
      description: domainConfig.description,
      robots: THIN_CONTENT_ROBOTS,
    };
  }
}

export default async function EpisodePlayerPage({ params }) {
  const { mediaType, id, season, episode } = params;
  const headersList = headers();
  const host = headersList.get("host") || "";
  const domainConfig = getDomainConfig(host);

  let data = null;
  try {
    data = await fetchDataFromApi(`/${mediaType}/${id}`);
  } catch (e) {}

  const title = data?.name || data?.title || "TV Show";
  const poster = data?.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${data.backdrop_path}`
    : domainConfig.ogImage;

  const videoSchema = getVideoObjectSchema({
    title: `${title} S${season} E${episode}`,
    description: `Watch ${title} Season ${season} Episode ${episode} in HD on ${domainConfig.brandName}`,
    thumbnailUrl: poster,
    uploadDate: data?.first_air_date,
    embedUrl: `${domainConfig.url}/player/${mediaType}/${id}/${season}/${episode}`,
    domainConfig,
  });

  const episodeSchema = {
    "@context": "https://schema.org",
    "@type": "TVEpisode",
    name: `${title} - Season ${season}, Episode ${episode}`,
    episodeNumber: Number(episode),
    partOfSeason: {
      "@type": "TVSeason",
      seasonNumber: Number(season),
    },
    partOfSeries: {
      "@type": "TVSeries",
      name: title,
    },
  };

  const breadcrumbs = getBreadcrumbSchema(
    [
      { name: "Home", url: "/" },
      { name: "TV Shows", url: "/explore/tv" },
      { name: title, url: `/${mediaType}/${id}` },
      {
        name: `S${season} E${episode}`,
        url: `/player/${mediaType}/${id}/${season}/${episode}`,
      },
    ],
    domainConfig
  );

  return (
    <>
      <SeoHead schemas={[videoSchema, episodeSchema, breadcrumbs]} />
      <Player params={params} />
      <ThinContentFaq
        title={`${title} Season ${season} Episode ${episode}`}
        brandName={domainConfig.brandName}
        mediaType="tv"
      />
    </>
  );
}
