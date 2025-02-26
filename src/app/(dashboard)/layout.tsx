import '../globals.css';
import {Analytics} from '@vercel/analytics/react';
import NavBar from "@/app/(dashboard)/nav";
import {auth, signOut} from "@/lib/auth";

export const metadata = {
  title: 'Visa overstay checker',
  description:
    'How do you know if you have overstayed your visa? Calculate how much time you have left.'
};
const handleSignOut = async () => {
  'use server';
  await signOut();
};
export default async function RootLayout({children}: {
  children: React.ReactNode;
}) {
  let session = await auth();
  let user = session?.user;
  return (
    <>
      <html lang="en">
      <body className="dark flex min-h-screen p-2 w-full flex-col">
      <NavBar user={user} onSignOut={handleSignOut}/>
      {children}
      </body>
      <Analytics/>
      </html>
    </>
  );
}
