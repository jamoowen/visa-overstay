import {auth} from "@/lib/auth";

export default async function Page() {
  const session = await auth();
  const user = session?.user;
  return (
    <div className='flex items-center justify-center'>
      <div className='flex flex-col max-w-[500px] items-start space-y-10  pt-32'>
        tracker...
      </div>
    </div>
  );
}
