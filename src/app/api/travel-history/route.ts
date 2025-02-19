import {NextRequest, NextResponse} from "next/server";
import {TravelHistoryDAO} from "@/dao/TravelHistoryDAO";
import {auth} from "@/lib/auth";
import {revalidateTag} from "next/cache";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = parseInt(searchParams.get("userId")||'');
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }
  const trips = await TravelHistoryDAO.getTrips(userId);
  return NextResponse.json({ trips: trips.unwrapOr([]) });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const user = session?.user;
  const {country, arrivalDate, departureDate} = await req.json();
  if (!user?.userId || !country || !arrivalDate) {
    return NextResponse.json({error: `Invalid arguments: ${[user?.userId, country, arrivalDate]}`}, {status: 400});
  }
  const upsertResult = await TravelHistoryDAO.insertTrip({
    userId: user.userId,
    country: country,
    arrivalDate: arrivalDate
  });
  if (upsertResult.isErr()) {
    console.error(`Error upserting user: ${upsertResult.error.message}`);
    return NextResponse.json(
      {error: "Failed to upsert user"},
      {status: 500}
    );
  }
  revalidateTag('trips')
  return NextResponse.json({userId: upsertResult.value})
}
