import React from "react";

/**
 * Renders JSON-LD structured data script
 */
export default function SeoHead({ schemas = [] }) {
  const schemaList = Array.isArray(schemas) ? schemas.filter(Boolean) : [schemas].filter(Boolean);

  if (schemaList.length === 0) return null;

  return (
    <>
      {schemaList.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      ))}
    </>
  );
}
