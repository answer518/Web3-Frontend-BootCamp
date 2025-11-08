'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const Providers = dynamic(() => import('../app/providers').then(mod => mod.Providers), {
  ssr: false,
});

export function ProvidersWrapper({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}