import {NextRequest, NextResponse} from "next/server";
import {TravelHistoryDAO} from "@/dao/TravelHistoryDAO";
import {auth} from "@/lib/auth";
import {revalidateTag} from "next/cache";
import {validateArgs} from "@/lib/api";
import {WorldCountries} from "@/data/world-countries"

export async function GET(req: NextRequest) {
  const {searchParams} = new URL(req.url);
  const userId = parseInt(searchParams.get("userId") || '');
  if (!userId) {
    return NextResponse.json(
      {error: "Missing userId"},
      {status: 400}
    );
  }
  const trips = await TravelHistoryDAO.getTrips(userId);
  return NextResponse.json(
    {travelHistory: trips.unwrapOr([])},
    {status: 200}
  );
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const user = session?.user;
  const {country, arrivalDate, departureDate} = await req.json();
  const args = validateArgs({userId: user?.userId, country, arrivalDate});
  if (args.isErr()) {
    return NextResponse.json(
      {error: args.error.message},
      {status: 400}
    );
  }
  const invalidCountry = !(country in WorldCountries);
  if (invalidCountry) {
    return NextResponse.json(
      {error: "Invalid country"},
      {status: 400}
    );
  }
  const result = await TravelHistoryDAO.insertTrip({
    userId: args.value.userId,
    country: args.value.country,
    arrivalDate: args.value.arrivalDate
  });
  if (result.isErr()) {
    return NextResponse.json(
      {error: result.error.message},
      {status: 500}
    );
  }
  revalidateTag('travel_history')
  return new Response(null, {
    status: 201,
  })
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  const user = session?.user;
  const {arrivalDate} = await req.json();
  const args = validateArgs({userId: user?.userId, arrivalDate});
  if (args.isErr()) {
    return NextResponse.json(
      {error: args.error.message},
      {status: 400}
    );
  }
  const result = await TravelHistoryDAO.deleteTrip(args.value.userId, args.value.arrivalDate);
  if (result.isErr()) {
    return NextResponse.json(
      {error: result.error.message},
      {status: 500}
    );
  }
  revalidateTag('travel_history')
  return new Response(null, {
    status: 204,
  })
}