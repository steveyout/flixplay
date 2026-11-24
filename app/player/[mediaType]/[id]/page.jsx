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
  const { mediaType, id } = params;
  const headersList = headers();
  const host = headersList.get("host") || "";
  const domainConfig = getDomainConfig(host);

  try {
    const data = await fetchDataFromApi(`/${mediaType}/${id}`);
    const title = data?.title || data?.name || "Player";
    const releaseYear = (data?.release_date || data?.first_air_date || "").split("-")[0];
    const yearSuffix = releaseYear ? ` (${releaseYear})` : "";

    const pageTitle =
      domainConfig.id === "fmovies"
        ? `Play ${title}${yearSuffix} Online Free - FMovies HD Player`
        : domainConfig.id === "yesmovies"
        ? `Play ${title}${yearSuffix} Online Free - YesMovies HD Player`
        : `Watch ${title}${yearSuffix} Online Free Player | Netmirror`;

    const description = `Stream and play ${title}${yearSuffix} in full HD quality with multiple server sources. Free online streaming on ${domainConfig.brandName}.`;

    return {
      title: pageTitle,
      description,
      robots: THIN_CONTENT_ROBOTS,
      alternates: {
        canonical: `${domainConfig.url}/player/${mediaType}/${id}`,
      },
      openGraph: {
        title: pageTitle,
        description,
        url: `${domainConfig.url}/player/${mediaType}/${id}`,
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
      title: `Stream on ${domainConfig.brandName}`,
      description: domainConfig.description,
      robots: THIN_CONTENT_ROBOTS,
    };
  }
}

export default async function PlayerPage({ params }) {
  const { mediaType, id } = params;
  const headersList = headers();
  const host = headersList.get("host") || "";
  const domainConfig = getDomainConfig(host);

  let data = null;
  try {
    data = await fetchDataFromApi(`/${mediaType}/${id}`);
  } catch (e) {}

  const title = data?.title || data?.name || "Video Stream";
  const poster = data?.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${data.backdrop_path}`
    : domainConfig.ogImage;

  const videoSchema = getVideoObjectSchema({
    title,
    description: data?.overview,
    thumbnailUrl: poster,
    uploadDate: data?.release_date || data?.first_air_date,
    embedUrl: `${domainConfig.url}/player/${mediaType}/${id}`,
    domainConfig,
  });

  const breadcrumbs = getBreadcrumbSchema(
    [
      { name: "Home", url: "/" },
      {
        name: mediaType === "tv" ? "TV Shows" : "Movies",
        url: `/explore/${mediaType}`,
      },
      { name: title, url: `/${mediaType}/${id}` },
      { name: "Player", url: `/player/${mediaType}/${id}` },
    ],
    domainConfig
  );

  return (
    <>
      <SeoHead schemas={[videoSchema, breadcrumbs]} />
      <Player params={params} />
      <ThinContentFaq
        title={title}
        brandName={domainConfig.brandName}
        mediaType={mediaType}
      />
    </>
  );
}
