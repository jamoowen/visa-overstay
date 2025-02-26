import {auth} from "@/lib/auth";
import TravelHistoryForm from "@/app/(dashboard)/travel-history/TravelHistoryForm";
import {TravelHistoryDAO} from "@/dao/TravelHistoryDAO";
import {unstable_cache} from 'next/cache'
import TravelHistory from "@/app/(dashboard)/travel-history/TravelHistory";
import {SelectTrip} from "@/db/schema";


const getTravelHistory = unstable_cache(
  async (userId):Promise<SelectTrip[]> => {
    console.log("getTravelHistory", userId)
    return (await TravelHistoryDAO.getTrips(userId)).unwrapOr([]);
  },
  ['travel_history'],
  { revalidate: 360000, tags: ['travel_history'] }
)

export default async function Page() {
  const session = await auth();
  const user = session?.user;
  if (!user?.userId) return null;

  const travelHistory = await getTravelHistory(user?.userId);

  return (
    <div className='flex items-center justify-center'>
      <div className='flex flex-col w-[500px] items-start space-y-10  pt-32'>
        <TravelHistory trips={travelHistory} userId={user.userId}/>
      </div>
    </div>
  );
}
