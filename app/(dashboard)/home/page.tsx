import { auth } from '@/lib/auth';

export default async function Page() {
  const session = await auth();
  const user = session?.user;
  if (!user || !user.email) {
    return null;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-screen overflow-x-auto sm:p-10">
        <div className="flex sm:p-5 py-5  w-full flex-col items-center  rounded-xl">
        </div>
      </div>
    </div>
  );
}

