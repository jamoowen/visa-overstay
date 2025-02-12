import {Button} from '@/components/ui/button';
import Link from 'next/link';
import {auth} from "@/lib/auth";

export default async function Page() {
  const session = await auth();
  const user = session?.user;
  console.log(user);
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
    <div className='flex flex-col items-center pt-20'>
     USER ALREADYU SIGNED in
    </div>
  );
}
