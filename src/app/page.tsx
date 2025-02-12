import {Button} from '@/components/ui/button';
import Link from 'next/link';
import {auth} from "@/lib/auth";

export default async function Page() {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    return (
      <div className='flex flex-col items-center pt-20'>
        <Button>
          <Link href="/login">Sign In</Link>
        </Button>
      </div>
    );
  }
  return (
    <div className='flex bg-green-300 w-full'>
      <div className='flex flex-col w-60 bg-red-50 text-5xl items-center pt-20'>
        Visas are annoying right? atleast this is the case for
        people that have shitty passports (I'm in this boat 😭)
        This site is intended to help people not overstay their visas
        and hopefully prevent their asses from getting deported.
        I will continue to work on this over time and will be adding features when I can.
        PR's are welcome
      </div>
    </div>
  );
}
