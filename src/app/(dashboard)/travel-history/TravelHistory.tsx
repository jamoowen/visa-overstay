"use client";

import {useEffect, useState} from "react";
import {SelectTrip} from "@/db/schema";
import TravelHistoryForm from "@/app/(dashboard)/travel-history/TravelHistoryForm";
import TravelHistoryList from "@/app/(dashboard)/travel-history/TravelHistoryList";


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
      <TravelHistoryForm userId={userId} setTripsList={setTripsList} />
      <TravelHistoryList trips={tripsList}/>
    </>
  );
}

export default TravelHistory;
