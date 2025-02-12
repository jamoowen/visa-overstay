import '../globals.css';
import {Analytics} from '@vercel/analytics/react';
import NavBar from "@/app/(dashboard)/nav";
import {auth, signOut} from "@/lib/auth";

export const metadata = {
  title: 'layout',
  description:
    'No name brand investments dashboard and investment tracker '
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
    <html lang="en">
    <body className="dark flex min-h-screen p-2 w-full flex-col">
    <NavBar
      user={user}
      onSignOut={handleSignOut}
    />
    {children}
    </body>
    <Analytics/>
    </html>
  );
}
