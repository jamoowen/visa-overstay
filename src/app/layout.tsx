import Image from 'next/image';
import './globals.css';
import logo from 'public/images/logo.png'
import { Analytics } from '@vercel/analytics/react';
import Link from 'next/link';
export const metadata = {
  title: 'Investment Dashboard',
  description:
    'No name brand investments dashboard and investment tracker '
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="dark flex min-h-screen p-2 w-full flex-col">
        {children}
      </body>
      <Analytics />
    </html>
  );
}
