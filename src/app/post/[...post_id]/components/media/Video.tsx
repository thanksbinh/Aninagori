'use client';

import { useEffect, useState } from 'react';

export function VideoComponent({ videoUrl, className }: { videoUrl: string; className: string }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return <div>{hydrated && <video src={videoUrl} controls className={`rounded-2xl ${className}`} />}</div>;
}
