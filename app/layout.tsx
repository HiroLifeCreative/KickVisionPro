import React from 'react';
import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Modern Dashboard',
  description: 'A clean, modern SaaS dashboard',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="font-sans antialiased bg-black text-white">{children}</body>
    </html>
  );
}
