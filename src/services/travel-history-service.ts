import {TravelHistoryDAO} from "@/dao/TravelHistoryDAO";
import {SelectTrip} from "@/db/schema";

export class TravelHistoryService {
  static dateDifferenceInDays(olderDate: Date, newerDate: Date) {
    return (newerDate.getTime() - olderDate.getTime()) / (1000 * 60 * 60 * 24);
  }


  static async calculateDurationOfAllTrips(userId: number, allTrips: SelectTrip[]) {
    //assuming alltrips is sorted in ascending order
    const tripsWithDuration = allTrips.map((trip, index) => {
      if (index < allTrips.length - 1) {
        return {
          ...trip,
          duration: this.dateDifferenceInDays(new Date(allTrips[index].arrivalDate), new Date(allTrips[index + 1].arrivalDate))
        }
      } else return trip;
    })
    return tripsWithDuration;
  }
}