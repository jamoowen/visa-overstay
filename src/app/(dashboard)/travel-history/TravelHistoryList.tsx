"use client";

import {useEffect, useState} from "react";
import {InsertTrip, SelectTrip} from "@/db/schema";
import {z} from "zod";
import {optimisticallyUpdateTripState} from "@/app/(dashboard)/travel-history/lib/utils";
import {toast} from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button";
import { XIcon} from "lucide-react";


export function TravelHistoryList({travelHistory, setTravelHistory}: { travelHistory: SelectTrip[], setTravelHistory: React.Dispatch<React.SetStateAction<SelectTrip[]>> }) {
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

  const [isLoading, setIsLoading] = useState(false);
  return (
    <>
      <div className="flex flex-col w-full border-white border h-[300px] items-start space-y-2  pt-5">
        {
          travelHistory.map((trip: SelectTrip) => {
            return (
              <div key={trip.arrivalDate} className="flex flex-row justify-between border border-white w-full">
                <Dialog>
                  <div className=" rounded-md p-2  -h items-start flex flex-col min-w-[200px]">
                    <h3>
                      {trip.country}
                    </h3>
                    <span className="text-sm ">Arrival date: {trip.arrivalDate} </span>
                    {/*<span className="text-sm ">Departure: {3} days</span>*/}
                    {/*<span className="text-sm ">Duration: {3} days </span>*/}
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
    </>
  );
}

export default TravelHistoryList;
