import { headers } from "next/headers";
import PlayerTv from "@/components/views/player/PlayerTv";
import SeoHead from "@/components/seo/SeoHead";
import ThinContentFaq from "@/components/seo/ThinContentFaq";
import oridata from "@/assets/keys.json";
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

  const channel = oridata.find((item) => item.channel_id == id);
  const channelName = channel?.channel_name || "Live TV Channel";

  const pageTitle =
    domainConfig.id === "fmovies"
      ? `Watch ${channelName} Live Stream Free Online | FMovies`
      : `Stream ${channelName} Live HD Free | Netmirror`;

  const description = `Watch ${channelName} live broadcast online for free in high definition on ${domainConfig.brandName}. Fast buffering and smooth streaming.`;

  return {
    title: pageTitle,
    description,
    robots: THIN_CONTENT_ROBOTS,
    alternates: {
      canonical: `${domainConfig.url}/player/livetv/${id}`,
    },
    openGraph: {
      title: pageTitle,
      description,
      url: `${domainConfig.url}/player/livetv/${id}`,
      siteName: domainConfig.siteName,
      images: [
        {
          url: channel?.channel_logo || domainConfig.ogImage,
        },
      ],
    },
  };
}

export default async function LiveTvPlayerPage({ params }) {
  const { id } = params;
  const headersList = headers();
  const host = headersList.get("host") || "";
  const domainConfig = getDomainConfig(host);

  const channel = oridata.find((item) => item.channel_id == id);
  const channelName = channel?.channel_name || "Live TV Channel";

  const videoSchema = getVideoObjectSchema({
    title: `${channelName} Live Stream`,
    description: `Watch live stream of ${channelName} in HD on ${domainConfig.brandName}`,
    thumbnailUrl: channel?.channel_logo || domainConfig.ogImage,
    embedUrl: `${domainConfig.url}/player/livetv/${id}`,
    domainConfig,
  });

  const breadcrumbs = getBreadcrumbSchema(
    [
      { name: "Home", url: "/" },
      { name: "Live TV", url: "/explore/livetv" },
      { name: channelName, url: `/player/livetv/${id}` },
    ],
    domainConfig
  );

  return (
    <>
      <SeoHead schemas={[videoSchema, breadcrumbs]} />
      <PlayerTv params={params} />
      <ThinContentFaq
        title={channelName}
        brandName={domainConfig.brandName}
        mediaType="livetv"
      />
    </>
  );
}
