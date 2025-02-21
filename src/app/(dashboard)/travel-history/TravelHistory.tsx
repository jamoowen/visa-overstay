"use client";

import {useEffect, useState} from "react";
import {SelectTrip} from "@/db/schema";
import TravelHistoryForm from "@/app/(dashboard)/travel-history/TravelHistoryForm";
import TravelHistoryList from "@/app/(dashboard)/travel-history/TravelHistoryList";

// async function getTravelHistory(userId:number) {
//   const response = await fetch(`/api/travel-history?userId=${userId}`, {
//     method: "GET",
//     headers: {"Content-Type": "application/json"},
//     cache: 'force-cache',
//     next: { tags: ['travel_history'] },
//   });
//   const data = await response.json();
//   return data.travelHistory;
// }

export function TravelHistory({userId, trips}: {userId: number, trips: SelectTrip[]}) {
  if (!trips) {
    return null
  }
  const [tripsList, setTripsList] = useState<SelectTrip[]>(trips);

  return (
    <>
      <h2 className="text-2xl font-extrabold">
        Travel History
      </h2>
      <TravelHistoryForm userId={userId} travelHistory={tripsList} setTravelHistory={setTripsList} />
      <TravelHistoryList travelHistory={tripsList} setTravelHistory={setTripsList}/>
    </>
  );
}

export default TravelHistory;
