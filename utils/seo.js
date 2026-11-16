export const DOMAINS = {
  FMOVIES: "fmovies.my",
  NETMIRROR: "netmirror.cfd",
};

export function getDomainConfig(rawHost = "") {
  const host = (rawHost || "").split(":")[0].toLowerCase();

  if (host.includes("fmovies.my") || host.includes("fmovie")) {
    return {
      id: "fmovies",
      domain: "fmovies.my",
      brandName: "FMovies",
      siteName: "FMovies",
      url: "https://fmovies.my",
      faviconSvg: "/favicon-fmovies.svg",
      faviconPng: "/favicon-fmovies.png",
      defaultTitle: "FMovies | Watch Movies & TV Series Online Free in HD",
      titleTemplate: "%s | FMovies - Watch Movies Online Free",
      description:
        "Watch the latest movies and TV series online in HD quality on FMovies. Stream full episodes and movies for free without registration. Fast, free and reliable HD streaming.",
      keywords: [
        "fmovies",
        "fmovie",
        "fmovies.my",
        "fmovies.to",
        "fmovies safe",
        "watch movies online free",
        "free hd movies",
        "stream tv series online",
        "watch free movies without signing up",
        "fmovies free streaming",
        "fmovies official",
        "stream movies hd",
        "full movies online",
      ],
      tagline:
        "Watch Free Movies & TV Shows Online in HD on FMovies. Millions of movies and series to discover.",
      heroTitle: "Welcome to FMovies",
      heroSubtitle:
        "Millions of movies, TV shows and people to discover. Stream your favorite content online in HD.",
      ogImage: "https://fmovies.my/og-banner.jpg",
      twitterHandle: "@fmovies",
    };
  }

  // Default is Netmirror (for netmirror.cfd, localhost, or any unspecified domain)
  return {
    id: "netmirror",
    domain: "netmirror.cfd",
    brandName: "Netmirror",
    siteName: "Netmirror",
    url: "https://netmirror.cfd",
    faviconSvg: "/favicon-netmirror.svg",
    faviconPng: "/favicon-netmirror.png",
    defaultTitle: "Netmirror | Watch HD Movies & TV Shows Online Free",
    titleTemplate: "%s | Netmirror - Stream Movies & TV Shows",
    description:
      "Stream the latest movies, Netflix web series, and TV shows online in HD quality on Netmirror. Watch free entertainment with zero buffering and no sign-up required.",
    keywords: [
      "netmirror",
      "netmirror.cfd",
      "net mirror",
      "netmirror app",
      "watch movies online free",
      "stream netflix shows free",
      "hd web series free",
      "netmirror movies",
      "watch full series free",
      "netmirror stream",
      "free hd streaming",
    ],
    tagline:
      "Stream Your Favorite Movies, Netflix Series & TV Shows Free in HD on Netmirror.",
    heroTitle: "Welcome to Netmirror",
    heroSubtitle:
      "Millions of movies, TV shows and series to discover. Explore and watch now in HD.",
    ogImage: "https://netmirror.cfd/og-banner.jpg",
    twitterHandle: "@netmirror",
  };
}

/**
 * Standard Robots configuration that allows indexing thin content
 * while preventing search engines from penalizing video player/embed pages.
 */
export const THIN_CONTENT_ROBOTS = {
  index: true,
  follow: true,
  nocache: false,
  googleBot: {
    index: true,
    follow: true,
    "max-video-preview": -1,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
};

/**
 * Generate WebSite Schema (JSON-LD) with SearchAction
 */
export function getWebsiteSchema(domainConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: domainConfig.siteName,
    alternateName: [domainConfig.brandName, domainConfig.domain],
    url: domainConfig.url,
    description: domainConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${domainConfig.url}/search/{search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Generate Breadcrumb Schema (JSON-LD)
 */
export function getBreadcrumbSchema(items, domainConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${domainConfig.url}${item.url}`,
    })),
  };
}

/**
 * Generate Movie Schema (JSON-LD)
 */
export function getMovieSchema(data, domainConfig, canonicalUrl) {
  if (!data) return null;
  const title = data.title || data.name || "Movie";
  const releaseYear = (data.release_date || "").split("-")[0];
  const posterUrl = data.poster_path
    ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
    : domainConfig.ogImage;

  return {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: title,
    headline: `${title} (${releaseYear}) - Watch Online Free on ${domainConfig.brandName}`,
    description: data.overview || `${title} streaming in HD on ${domainConfig.brandName}`,
    image: posterUrl,
    datePublished: data.release_date,
    duration: data.runtime ? `PT${data.runtime}M` : undefined,
    genre: data.genres?.map((g) => g.name) || [],
    aggregateRating: data.vote_average
      ? {
          "@type": "AggregateRating",
          ratingValue: data.vote_average.toFixed(1),
          bestRating: "10",
          worstRating: "1",
          ratingCount: data.vote_count || 100,
        }
      : undefined,
    url: canonicalUrl || `${domainConfig.url}/movie/${data.id}`,
    provider: {
      "@type": "Organization",
      name: domainConfig.brandName,
      url: domainConfig.url,
    },
  };
}

/**
 * Generate TV Series Schema (JSON-LD)
 */
export function getTvSeriesSchema(data, domainConfig, canonicalUrl) {
  if (!data) return null;
  const title = data.name || data.title || "TV Show";
  const releaseYear = (data.first_air_date || "").split("-")[0];
  const posterUrl = data.poster_path
    ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
    : domainConfig.ogImage;

  return {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    name: title,
    headline: `${title} (${releaseYear}) - Watch Full Episodes Free on ${domainConfig.brandName}`,
    description: data.overview || `${title} all seasons streaming in HD on ${domainConfig.brandName}`,
    image: posterUrl,
    datePublished: data.first_air_date,
    numberOfSeasons: data.number_of_seasons || (data.seasons ? data.seasons.length : 1),
    numberOfEpisodes: data.number_of_episodes,
    genre: data.genres?.map((g) => g.name) || [],
    aggregateRating: data.vote_average
      ? {
          "@type": "AggregateRating",
          ratingValue: data.vote_average.toFixed(1),
          bestRating: "10",
          worstRating: "1",
          ratingCount: data.vote_count || 100,
        }
      : undefined,
    url: canonicalUrl || `${domainConfig.url}/tv/${data.id}`,
    provider: {
      "@type": "Organization",
      name: domainConfig.brandName,
      url: domainConfig.url,
    },
  };
}

/**
 * Generate VideoObject Schema (JSON-LD) for Player pages
 * This enables search engines to index player embeds and treats thin pages as valid rich video entities.
 */
export function getVideoObjectSchema({
  title,
  description,
  thumbnailUrl,
  uploadDate,
  embedUrl,
  domainConfig,
}) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: `${title} - Watch Full HD on ${domainConfig.brandName}`,
    description:
      description || `Watch full video of ${title} online for free in HD on ${domainConfig.brandName}.`,
    thumbnailUrl: thumbnailUrl || domainConfig.ogImage,
    uploadDate: uploadDate || new Date().toISOString(),
    embedUrl: embedUrl,
    publisher: {
      "@type": "Organization",
      name: domainConfig.brandName,
      logo: {
        "@type": "ImageObject",
        url: `${domainConfig.url}${domainConfig.faviconPng}`,
      },
    },
  };
}

/**
 * Generate FAQ Schema (JSON-LD) to augment thin-content pages with crawlable Q&A
 */
export function getFaqSchema(faqs) {
  if (!faqs || faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}
