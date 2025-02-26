import {Button} from '@/components/ui/button';
import Link from 'next/link';
import Image from "next/image";
import logo from "public/images/logo.png";

export default async function Page() {

  return (
    <div className='flex flex-col items-center justify-center'>
      <div className="relative w-[80%] mt-12  h-32 mx-auto">
        <Link href='/'>
          <Image
            alt="logo"
            src={logo}
            fill={true}
            priority // Ensures the logo loads quickly
          />
        </Link>
      </div>
      <div className='flex flex-col max-w-[500px] space-y-3 items-center pt-10'>

        <Button className="mb-10 hover:bg-purple-500">
          <Link href="/login">Sign In</Link>
        </Button>
        <span>
          Visas are annoying right??? atleast this is the case for
          people that have shitty passports (I'm in this boat 😭)
        </span>
        <span>
          This site is intended to help people not overstay their visas
          and hopefully prevent their asses from getting deported.
        </span>
        <span>
          Just enter your past departure dates and the country you found yourself in.
          With a little quick maths, I'll break down your tenure and determine whether
          you are at risk of breaching the terms of your visa. 🫨
        </span>

        <span className="text-xs text-opacity-50">
          PS: Dont take my advice as gospel - im just some random dude on the internet
          and do NOT specialise in immigration law. <br/>
          PSS: Im taking my own advice so if its any consolation.
        </span>
      </div>
    </div>
  );
}
