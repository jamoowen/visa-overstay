import {auth} from "@/lib/auth";
import {ArrowBigDown, ArrowBigRight} from "lucide-react";

export default async function Page() {
  const session = await auth();
  const user = session?.user;
  return (
    <div className='flex items-center justify-center'>
      <div className='flex flex-col max-w-[500px] items-start space-y-10  pt-32'>
        <div className="flex flex-col items-start">
          <h3 className="text-xl font-bold underline mb-2">
          Maintaining eligibility for UK ILR
          </h3>
          In order to maintain eligibility for indefinite leave to remain in the uk, most visa holders
          are required to have spent a continuous amount of years in the UK on a UK visa.
          In most cases you must have spent no more than 180 days outside the UK in any 12 month period.

          <a className="text-purple-500 hover:underline mt-1" href="https://www.gov.uk/indefinite-leave-to-remain" target='_blank'>Check the gov website for more detail</a>

        </div>


      </div>
    </div>
  );
}
