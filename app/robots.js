import { headers } from "next/headers";
import { getDomainConfig } from "@/utils/seo";

export default function robots() {
  const headersList = headers();
  const host = headersList.get("host") || "";
  const domainConfig = getDomainConfig(host);

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
      },
    ],
    sitemap: `${domainConfig.url}/sitemap.xml`,
  };
}
