'use client'

import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {User} from "next-auth";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useState} from "react";
import Image from "next/image";
import logo from "../../../public/images/logo.png";

export default function NavBar({user, onSignOut}: {
  user: User | undefined,
  onSignOut: () => Promise<void>
}) {
  const pathname = usePathname() || "/home";
  const [activePath, setActivePath] = useState(pathname);

  return (
    <nav
      className="bg-white dark:bg-background fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <div
          className="items-center justify-between  flex w-auto order-0"
          id="navbar-sticky"
        >
          <ul className="flex flex-row sm:space-x-8 space-x-3 rtl:space-x-reverse border-0">
            <li>
              <Link
                onClick={() => setActivePath('/home')}
                href="/home"
                className={cn(activePath === '/home' && 'underline',
                  'text-purple-600 dark:text-purple-400 font-semibold'
                )}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                onClick={() => setActivePath('/tracker')}
                href="/tracker"
                className={cn(
                  activePath === '/tracker' && 'underline',
                  'text-purple-600 dark:text-purple-400 font-semibold'
                )}
              >
                Tracker
              </Link>
            </li>
          </ul>
        </div>
       
        <div className="flex flex-col items-end">
          <form
            className="md:order-1"
            action={onSignOut}
          >
            <Button size={'sm'} className="" type="submit">Sign Out</Button>
          </form>
        </div>
      </div>
    </nav>
  );
}