import { headers } from "next/headers";
import Script from "next/script";
import "@/styles/globals.scss";
import ReduxProvider from "@/store/ReduxProvider";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import SeoHead from "@/components/seo/SeoHead";
import NavigationLoader from "@/components/NavigationLoader";
import {
  getDomainConfig,
  getWebsiteSchema,
  THIN_CONTENT_ROBOTS,
} from "@/utils/seo";

export async function generateMetadata() {
  const headersList = headers();
  const host = headersList.get("host") || "";
  const config = getDomainConfig(host);

  return {
    title: {
      default: config.defaultTitle,
      template: config.titleTemplate,
    },
    description: config.description,
    keywords: config.keywords,
    metadataBase: new URL(config.url),
    alternates: {
      canonical: config.url,
    },
    robots: THIN_CONTENT_ROBOTS,
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
          alt: config.siteName,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: config.defaultTitle,
      description: config.description,
      images: [config.ogImage],
      creator: config.twitterHandle,
    },
    icons: {
      icon: [
        { url: config.faviconSvg, type: "image/svg+xml" },
        { url: config.faviconPng, sizes: "512x512", type: "image/png" },
      ],
      apple: [{ url: config.faviconPng, sizes: "180x180" }],
    },
  };
}

export default function RootLayout({ children }) {
  const headersList = headers();
  const host = headersList.get("host") || "";
  const domainConfig = getDomainConfig(host);
  const websiteSchema = getWebsiteSchema(domainConfig);
  const gtagId = process.env.NEXT_PUBLIC_GTAG_ID || "G-036WVR6DSV";

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#04152d" />
        <link rel="icon" type="image/svg+xml" href={domainConfig.faviconSvg} />
        <link rel="alternate icon" href={domainConfig.faviconPng} />
        <link rel="apple-touch-icon" href={domainConfig.faviconPng} />
        <SeoHead schemas={[websiteSchema]} />
      </head>
      <body>
        <NavigationLoader />
        <ReduxProvider>
          <Header initialDomainConfig={domainConfig} />
          <main className="pageTransitionWrapper">{children}</main>
          <Footer initialDomainConfig={domainConfig} />
        </ReduxProvider>

        {/* Google Analytics Tag */}
        {gtagId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gtagId}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
