import React from "react";

export default function CertificatePage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Certificate: {slug}</h1>
      <p className="mt-2 text-muted-foreground">Details for program {slug}.</p>
    </div>
  );
}
