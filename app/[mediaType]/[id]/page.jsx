import { headers } from "next/headers";
import Details from "@/components/views/details/Details";
import SeoHead from "@/components/seo/SeoHead";
import ThinContentFaq from "@/components/seo/ThinContentFaq";
import { fetchDataFromApi } from "@/utils/api";
import {
  getDomainConfig,
  getMovieSchema,
  getTvSeriesSchema,
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
    const title = data?.title || data?.name || "Watch Online";
    const releaseYear = (data?.release_date || data?.first_air_date || "").split("-")[0];
    const yearSuffix = releaseYear ? ` (${releaseYear})` : "";
    const poster = data?.poster_path
      ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
      : domainConfig.ogImage;

    const pageTitle =
      domainConfig.id === "fmovies"
        ? `Watch ${title}${yearSuffix} Online Free in HD | FMovies`
        : domainConfig.id === "yesmovies"
        ? `Watch ${title}${yearSuffix} Online Free in HD | YesMovies`
        : `Stream ${title}${yearSuffix} Full HD Free | Netmirror`;

    const description =
      data?.overview
        ? `${data.overview.slice(0, 155)}... Watch ${title}${yearSuffix} in HD on ${domainConfig.brandName}.`
        : `Watch ${title}${yearSuffix} online free in full HD on ${domainConfig.brandName}. High-speed streaming without subscription.`;

    const canonicalUrl = `${domainConfig.url}/${mediaType}/${id}`;

    return {
      title: pageTitle,
      description,
      keywords: [
        title,
        `${title} watch online`,
        `${title} free streaming`,
        `${title} hd`,
        `${title} ${domainConfig.brandName}`,
        ...(data?.genres?.map((g) => g.name) || []),
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
        images: [{ url: poster, width: 500, height: 750, alt: title }],
        type: mediaType === "tv" ? "video.tv_show" : "video.movie",
      },
      twitter: {
        card: "summary_large_image",
        title: pageTitle,
        description,
        images: [poster],
      },
    };
  } catch (e) {
    return {
      title: `${domainConfig.brandName} | Watch Movies & TV Shows Free in HD`,
      description: domainConfig.description,
      robots: THIN_CONTENT_ROBOTS,
    };
  }
}

export default async function DetailsPage({ params }) {
  const { mediaType, id } = params;
  const headersList = headers();
  const host = headersList.get("host") || "";
  const domainConfig = getDomainConfig(host);

  let data = null;
  try {
    data = await fetchDataFromApi(`/${mediaType}/${id}`);
  } catch (err) {
    console.error("Error loading details for SEO schema:", err);
  }

  const title = data?.title || data?.name || "Entertainment";
  const canonicalUrl = `${domainConfig.url}/${mediaType}/${id}`;

  const mediaSchema =
    mediaType === "tv"
      ? getTvSeriesSchema(data, domainConfig, canonicalUrl)
      : getMovieSchema(data, domainConfig, canonicalUrl);

  const breadcrumbs = getBreadcrumbSchema(
    [
      { name: "Home", url: "/" },
      {
        name: mediaType === "tv" ? "TV Shows" : "Movies",
        url: `/explore/${mediaType}`,
      },
      { name: title, url: `/${mediaType}/${id}` },
    ],
    domainConfig
  );

  return (
    <>
      <SeoHead schemas={[mediaSchema, breadcrumbs]} />
      <Details params={params} />
      <ThinContentFaq
        title={title}
        brandName={domainConfig.brandName}
        mediaType={mediaType}
      />
    </>
  );
}
