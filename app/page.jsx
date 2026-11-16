import { headers } from "next/headers";
import Home from "@/components/views/home/Home";
import ThinContentFaq from "@/components/seo/ThinContentFaq";
import { getDomainConfig, THIN_CONTENT_ROBOTS } from "@/utils/seo";

export async function generateMetadata() {
  const headersList = headers();
  const host = headersList.get("host") || "";
  const config = getDomainConfig(host);

  return {
    title: config.defaultTitle,
    description: config.description,
    keywords: config.keywords,
    robots: THIN_CONTENT_ROBOTS,
    alternates: {
      canonical: config.url,
    },
    openGraph: {
      title: config.defaultTitle,
      description: config.description,
      url: config.url,
      siteName: config.siteName,
      images: [
        {
          url: config.ogImage,
          width: 1200,
          height: 630,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: config.defaultTitle,
      description: config.description,
      images: [config.ogImage],
    },
  };
}

export default function HomePage() {
  const headersList = headers();
  const host = headersList.get("host") || "";
  const domainConfig = getDomainConfig(host);

  return (
    <>
      <Home />
      <ThinContentFaq
        title="Trending Movies & TV Shows"
        brandName={domainConfig.brandName}
        mediaType="all"
      />
    </>
  );
}
