import {auth} from "@/lib/auth";
import {ArrowBigDown, ArrowBigRight} from "lucide-react";

export default async function Page() {
  const session = await auth();
  const user = session?.user;
  console.log(`USER: ${JSON.stringify(user)}`);
  return (
    <div className='flex items-center justify-center'>
      <div className='flex flex-col max-w-[500px] items-start space-y-10  pt-32'>
        <span>
          Just enter your past departure dates and the country you found yourself in.
          With a little quick maths, I'll break down your tenure and determine whether
          you are at risk of breaching the terms of your visa. 🫨
        </span>
        <span>
          <text className='underline'>
          Currently supported features:
          </text>
          <ul className='text-gray-200 list-disc'>
            <li>
              Time spent in country in 12 month rolling period
            </li>
            <li>
              Time spent out of country in 12 month rolling period
            </li>
            <li>
              Risk of breaching UK visa
            </li>
          </ul>
        </span>
        <span>
        I will continue to work on this over time and will be adding features when I can.
        PR's are welcome <ArrowBigDown/>
          <a
            className='hover:text-purple-500'
            href={'https://github.com/jamoowen/visa-overstay'}
            target={'_blank'}>
          https://github.com/jamoowen/visa-overstay
        </a>
        </span>
        <span className="text-xs text-opacity-50">
          Again, Im not a lawyer and this app should be used as a rough guideline,
          not the law.
        </span>
      </div>
    </div>
  );
}
