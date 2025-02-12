import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function Page() {
  return (
    <div className='flex flex-col items-center pt-20'>
      <Button>
        <Link href="/login">Sign In</Link>
      </Button>
    </div>
  );  
}
