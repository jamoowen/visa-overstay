import {SelectTrip} from "@/db/schema";
import {WorldCountries} from "@/data/world-countries.js";
import {EnrichedTrip, WorldCountryKey} from "@/types/travel";

export class TravelHistoryService {
  static absoluteDateDifferenceInDays(date1: Date, date2: Date) {
    return  Math.floor((Math.abs(date1.getTime() - date2.getTime())) / (1000 * 60 * 60 * 24));
  }

  static enrichTripsWithCountryAndDurationData(allTrips: SelectTrip[]): EnrichedTrip[] {
    //assuming alltrips is sorted in descending order
    const enrichedTrips = allTrips.map((trip, index) => {
      const country = WorldCountries[trip.country as WorldCountryKey];
      console.log(`countr:L ${country}, ${trip.country}`)
      const duration = index > 0 && allTrips.length>1
        ? this.absoluteDateDifferenceInDays(new Date(allTrips[index].arrivalDate), new Date(allTrips[index - 1].arrivalDate))
        : this.absoluteDateDifferenceInDays(new Date(allTrips[index].arrivalDate), new Date())
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
}