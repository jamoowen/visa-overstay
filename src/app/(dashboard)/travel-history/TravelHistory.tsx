"use client";

import { useEffect, useState } from "react";
import { SelectTrip } from "@/db/schema";
import TravelHistoryForm from "@/app/(dashboard)/travel-history/TravelHistoryForm";
import TravelHistoryList from "@/app/(dashboard)/travel-history/TravelHistoryList";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";


export function TravelHistory({ userId, trips }: { userId: number, trips: SelectTrip[] }) {
  if (!trips) {
    return null
  }
  const [tripsList, setTripsList] = useState<SelectTrip[]>(trips);

  return (
    <>
      <div className="flex flex-row">

        <h2 className="text-2xl font-extrabold">
          Travel History
        </h2>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button size="lg" variant="link"><InfoIcon size="xl"/></Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="flex justify-between space-x-4">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">Building out your travel history:</h4>
                <p className="text-sm">
                  All you need to do is add the arrival dates of your trips.
                  We calculate your tenure in a given country through
                  the difference between your arrival date, and the arrival date of the next country you travel to.
                </p>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>

      <TravelHistoryForm userId={userId} travelHistory={tripsList} setTravelHistory={setTripsList}/>
      <TravelHistoryList travelHistory={tripsList} setTravelHistory={setTripsList}/>
    </>
  );
}

export default TravelHistory;
