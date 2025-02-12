import '../globals.css';
import { Analytics } from '@vercel/analytics/react';
export const metadata = {
  title: 'layout',
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
        <div className="relative w-full max-w-[800px] mt-20 h-16 mx-auto">
        </div>
        {children}
      </body>
      <Analytics />
    </html>
  );
}
