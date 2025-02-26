"use client";

import {useEffect, useState} from "react";
import {InsertTrip, SelectTrip} from "@/db/schema";
import {toast} from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button";
import { XIcon} from "lucide-react";
import { DaysSpentTravelling, EnrichedTrip } from "@/types/travel";
import {TravelHistoryService} from "@/services/travel-history-service";


export function TravelHistoryList({travelHistory, setTravelHistory}: { travelHistory: SelectTrip[], setTravelHistory: React.Dispatch<React.SetStateAction<SelectTrip[]>> }) {
  const travelHistoryService = new TravelHistoryService();

  if (!travelHistory) {
    return null
  }

  async function handleDelete(arrivalDate: string) {
    setIsLoading(true)
    if (arrivalDate == null) {
      console.error("Invalid arrivalDate");
      return;
    }
    try {
      const response = await fetch(`/api/travel-history`, {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({arrivalDate}),
      });
      if (!response.ok) {
        throw new Error(`Error updating travel-history: ${response.statusText}`);
      }
      setTravelHistory((previousTrips: SelectTrip[]) => {
        return previousTrips.filter(trip => trip.arrivalDate !== arrivalDate);
      });
      toast({
        title: "Success!",
        description: "Trip removed.",
      });
    } catch (error) {
      console.error(`Failed to update travel-history:`, error);
      toast({
        title: "Error",
        description: "Damn we couldnt delete that one... try again maybe?",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }

  useEffect(() => {
    const enrichedTrips = travelHistoryService.enrichTripsWithCountryAndDurationData(travelHistory);
    const daysSpent = travelHistoryService.calculateDaysSpentTravelling(
      travelHistoryService.cutoffTripsAtTwelveMonths(new Date, enrichedTrips)
    )
    setEnrichedTravelHistory(enrichedTrips);
    setDaysSpentTravelling(daysSpent);
  }, [travelHistory]);

  const [enrichedTravelHistory, setEnrichedTravelHistory] = useState<EnrichedTrip[]>([]);
  const [daysSpentTravelling, setDaysSpentTravelling] = useState<DaysSpentTravelling | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  if (daysSpentTravelling==null) return null;
  return (
    <div className="flex flex-col">
      <span>
        Days spent outside of UK in last 12 months: {daysSpentTravelling.daysSpentOutsideUK}
      </span>
      <span>
        Days spent in Europe in the last 12 months: {daysSpentTravelling.daysSpentInEU}
      </span>
      <div className="flex flex-col w-full mt-5  h-[500px] border-t-2 border-white py-5 no-scrollbar overflow-auto items-start space-y-2  pt-5">
        {
          enrichedTravelHistory.map((trip: EnrichedTrip, index) => {
            return (
              <div key={trip.arrivalDate} className="flex flex-row justify-between  w-full">
                <Dialog>
                  <div className=" rounded-md p-2  -h items-start flex flex-col min-w-[200px]">
                    <h3 className="flex justify-between w-full">
                      {trip.countryName} {index===0 && <span className="text-green-500 text-xs ml-10">current</span>}
                    </h3>
                    <span className="text-sm ">Arrival date: {trip.arrivalDate} </span>
                    {/*<span className="text-sm ">Departure: {3} days</span>*/}
                    {trip.duration && <span className="text-sm ">Duration: {trip.duration} days </span>}
                  </div>
                  <DialogTrigger>
                   <XIcon className="hover:text-red-600"/>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete trip</DialogTitle>
                      <div className=" rounded-md p-2  -h items-start flex flex-col min-w-[200px]">
                        <h3>
                          {trip.country}
                        </h3>
                        <span className="text-sm ">Arrival date: {trip.arrivalDate} </span>
                        {/*<span className="text-sm ">Departure: {3} days</span>*/}
                        {/*<span className="text-sm ">Duration: {3} days </span>*/}
                      </div>
                    </DialogHeader>
                    <Button disabled={isLoading} onClick={()=>handleDelete(trip.arrivalDate)}>Delete</Button>
                  </DialogContent>
                </Dialog>
              </div>
            )
          })
        }
      </div>
    </div>
  );
}

export default TravelHistoryList;
