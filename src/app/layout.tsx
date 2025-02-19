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
    <body>
    <main>{children}</main>
    <Toaster/>
    </body>
    <Analytics/>
    </html>
    </>
  );
}
