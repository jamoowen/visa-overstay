import './globals.css';
import {Analytics} from '@vercel/analytics/react';
import {Toaster} from "@/components/ui/toaster";

export const metadata = {
  title: 'Visa overstay checker',
  description:
    'How do you know if you have overstayed your visa? Calculate how much time you have left.'
};

export default function RootLayout({children}: {
  children: React.ReactNode;
}) {
  return (
    <>
    <html lang="en">
    <head title={'visa overstay checker'}/>
    <body className="dark flex min-h-screen p-2 w-full flex-col">
    <main>{children}</main>
    <Toaster/>
    </body>
    <Analytics/>
    </html>
    </>
  );
}
