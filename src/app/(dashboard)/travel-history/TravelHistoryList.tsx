"use client";

import {useEffect, useState} from "react";
import {SelectTrip} from "@/db/schema";


export function TravelHistoryList({trips}: {trips: SelectTrip[]}) {
  if (!trips) {
    return null
  }

  return (
    <>
      <div className="flex flex-col w-full border-white border h-[300px] items-start space-y-2  pt-5">
        {
          trips.map((trip: SelectTrip) => {
            return (
              <div className=" rounded-md p-2  - flex flex-col min-w-[200px]">
                <h3>
                  {trip.country}
                </h3>
                <span className="text-sm ">Arrival date: {trip.arrivalDate} </span>
                {/*<span className="text-sm ">Departure: {3} days</span>*/}
                {/*<span className="text-sm ">Duration: {3} days </span>*/}
              </div>
            )

          })
        }
      </div>
    </>
  );
}

export default TravelHistoryList;
