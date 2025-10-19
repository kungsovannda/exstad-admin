"use client";
import React from "react";

interface PdfPreviewProps {
  src: string;
  className?: string;
  toolbar?: boolean;
}

export function PdfPreview({ src, className, toolbar = false }: PdfPreviewProps) {
  const [blobUrl, setBlobUrl] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    let currentUrl: string | null = null;

    const load = async () => {
      try {
        setError(null);
        setBlobUrl(null);

        const apiUrl = `/api/pdf?src=${encodeURIComponent(src)}`;
        const res = await fetch(apiUrl, { cache: "no-store" });
        if (!res.ok) {
          setError(`Failed to load (${res.status})`);
          return;
        }
        const buf = await res.arrayBuffer();
        const blob = new Blob([buf], { type: "application/pdf" });
        currentUrl = URL.createObjectURL(blob);
        if (!cancelled) setBlobUrl(currentUrl);
      } catch {
        setError("Failed to load");
      }
    };

    load();

    return () => {
      cancelled = true;
      if (currentUrl) URL.revokeObjectURL(currentUrl);
    };
  }, [src]);

  if (error) return <div className={className}>Failed to load</div>;
  if (!blobUrl) return <div className={className} />;

  const params = toolbar ? "" : "#toolbar=0&navpanes=0&scrollbar=0&view=FitH&zoom=page-fit";
  return <object data={`${blobUrl}${params}`} type="application/pdf" className={className} />;
}