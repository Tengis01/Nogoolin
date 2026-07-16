import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ногоолин',
  description: 'Сүсэг бишрэлийн бүтээгдэхүүний цахим лавлах',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="mn">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
