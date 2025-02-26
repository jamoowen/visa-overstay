import {SelectTrip} from "@/db/schema";
import {WorldCountries} from "@/data/world-countries.js";
import {EnrichedTrip, WorldCountryKey} from "@/types/travel";
import { DateUtils } from "@/lib/date-utils";

export class TravelHistoryService {


  static enrichTripsWithCountryAndDurationData(allTrips: SelectTrip[]): EnrichedTrip[] {
    //assuming alltrips is sorted in descending order
    const enrichedTrips = allTrips.map((trip, index) => {
      const country = WorldCountries[trip.country as WorldCountryKey];
      const duration = index > 0 && allTrips.length>1
        ? DateUtils.calculateAbsoluteDateDifferenceInDays(new Date(allTrips[index].arrivalDate), new Date(allTrips[index - 1].arrivalDate))
        : DateUtils.calculateAbsoluteDateDifferenceInDays(new Date(allTrips[index].arrivalDate), new Date())
      const enrichedTrip: EnrichedTrip = {
        country: trip.country,
        countryName: country.name,
        arrivalDate: trip.arrivalDate,
        duration: duration,
        isEuTrip: country.eu,
        continent: country.continent,
      }
      return enrichedTrip
    })
    return enrichedTrips;
  }

  /*
  * @todo days outiside of uk in 12 month rolling period
  * @todo days in eu in 12 month rolling period
  * @todo consecutive days?
  * @todo
  * */
  // need to cut off the tip data at 12 months
  // need some date functions
  static cutoffTripsAtTwelveMonths(trips: EnrichedTrip[]) {
    const today = new Date();
    const twelveMonthsAgo = today.setFullYear(today.getFullYear() - 1);
    if (trips.length===0) return [];
    for (let i = 0; i <= trips.length; i++) {
      const arrivalDate = new Date(trips[i].arrivalDate);
      if (arrivalDate.getTime()<twelveMonthsAgo) {
        // in this scenario we need to subtract from the duration the difference between 12 months ago and arrivalDate
      }
    }

    const daysOutsideOfUkInLast12Months= trips.reduce((acc, trip)=> {
      if (trip.country==="unitedKingdom") {acc+=trip.duration}
      return acc;
    }, 0)
  }
}