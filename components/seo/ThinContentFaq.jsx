import React from "react";
import ContentWrapper from "../contentWrapper/ContentWrapper";

/**
 * ThinContentFaq provides crawlable, rich semantic FAQs and details
 * to prevent algorithmic "thin content" demotion on player and streaming pages.
 */
export default function ThinContentFaq({ title, brandName, mediaType, faqs }) {
  const defaultFaqs = [
    {
      q: `Can I stream ${title ? `"${title}"` : "movies and TV shows"} online for free on ${brandName}?`,
      a: `Yes, ${brandName} provides free HD streaming for ${title ? `"${title}"` : "movies and series"} with multiple fast servers, zero registration, and no subscription fees.`,
    },
    {
      q: `What video qualities and sources are available on ${brandName}?`,
      a: `${brandName} offers 1080p Full HD and 720p streaming options across multiple reliable mirrors (Source 1 through Source 7) ensuring fast buffering and uninterrupted playback.`,
    },
    {
      q: `Is ${brandName} compatible with mobile, tablet, and smart TVs?`,
      a: `Yes, ${brandName} is completely responsive and optimized for seamless streaming on mobile phones, tablets, laptops, desktops, and smart TVs without any app download.`,
    },
    {
      q: `How often are new episodes and releases updated on ${brandName}?`,
      a: `${brandName} updates its catalog daily with the latest theatrical releases, trending Netflix and TV series episodes, and popular anime.`,
    },
  ];

  const items = faqs || defaultFaqs;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  return (
    <section className="thinContentSeoSection" style={{ padding: "40px 0 20px 0", color: "#fff" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <ContentWrapper>
        <div
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "12px",
            padding: "24px 28px",
            marginTop: "30px",
          }}
        >
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "600",
              marginBottom: "16px",
              color: "var(--orange, #f89e00)",
            }}
          >
            Stream {title ? `"${title}"` : "Entertainment"} on {brandName} — Frequently Asked Questions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {items.map((item, idx) => (
              <details
                key={idx}
                style={{
                  background: "rgba(0, 0, 0, 0.2)",
                  padding: "12px 18px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                <summary
                  style={{
                    fontWeight: "500",
                    fontSize: "15px",
                    outline: "none",
                    color: "#fff",
                  }}
                >
                  {item.q}
                </summary>
                <p
                  style={{
                    marginTop: "10px",
                    fontSize: "14px",
                    lineHeight: "1.6",
                    color: "rgba(255, 255, 255, 0.75)",
                  }}
                >
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </ContentWrapper>
    </section>
  );
}
