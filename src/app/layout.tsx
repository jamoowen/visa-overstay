import './globals.css';
import { Analytics } from '@vercel/analytics/react';
export const metadata = {
  title: 'Visa overstay checker',
  description:
    'How do you know if you have overstayed your visa? Calculate how much time you have left.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen dark p-2 w-full flex-col">
        {children}
      </body>
      <Analytics />
    </html>
  );
}
