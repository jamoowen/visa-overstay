import { SelectTrip } from "@/db/schema";
import { WorldCountries } from "@/data/world-countries.js";
import { DaysSpentTravelling, EnrichedTrip, WorldCountryKey } from "@/types/travel";
import { DateUtils } from "@/lib/date-utils";

export interface TravelHistoryProcessor {
  enrichTripsWithCountryAndDurationData(allTrips: SelectTrip[]): EnrichedTrip[];
  cutoffTripsAtTwelveMonths(today: Date, trips: EnrichedTrip[]): EnrichedTrip[];
  calculateDaysSpentTravelling(trips: EnrichedTrip[], homeCountry?: WorldCountryKey): DaysSpentTravelling;
}

export class TravelHistoryService implements TravelHistoryProcessor{
  public enrichTripsWithCountryAndDurationData(allTrips: SelectTrip[]): EnrichedTrip[] {
    //assuming alltrips is sorted in descending order
    const enrichedTrips = allTrips.map((trip, index) => {
      const country = WorldCountries[trip.country as WorldCountryKey];
      const duration = index > 0 && allTrips.length > 1
        ? DateUtils.calculateAbsoluteDateDifferenceInDays(new Date(allTrips[index].arrivalDate), new Date(allTrips[index - 1].arrivalDate))
        : DateUtils.calculateAbsoluteDateDifferenceInDays(new Date(allTrips[index].arrivalDate), DateUtils.getFloorOfDate(new Date()))
      const enrichedTrip: EnrichedTrip = {
        country: trip.country as WorldCountryKey,
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

  public cutoffTripsAtTwelveMonths(today: Date, trips: EnrichedTrip[]): EnrichedTrip[] {
    const currentYMD = DateUtils.getFloorOfDate(today);
    const twelveMonthsAgo = new Date(currentYMD.getFullYear() - 1, currentYMD.getMonth(), currentYMD.getDate());
    const modifiedTrips: EnrichedTrip[] = [];
    for (let i = 0; i < trips.length; i++) {
      const arrivalDate = new Date(trips[i].arrivalDate);
      if (arrivalDate.getTime() >= twelveMonthsAgo.getTime()) {
        modifiedTrips.push(trips[i]);
        continue;
      }
      const dateDiff = DateUtils.calculateAbsoluteDateDifferenceInDays(arrivalDate, twelveMonthsAgo);
      console.log(`date diff: ${dateDiff} for ${i} `);
      if (dateDiff > trips[i].duration) {
        break;
      }
      modifiedTrips.push({
        ...trips[i],
        duration: dateDiff
      })
      break;
    }
    return modifiedTrips;
  }

  public calculateDaysSpentTravelling(trips: EnrichedTrip[], homeCountry?:WorldCountryKey): DaysSpentTravelling {
    const daysSpentObject: DaysSpentTravelling = {
      daysSpentInEU: 0,
      daysSpentOutsideUK: 0,
      ...(homeCountry ? { daysSpentOutsideHomeCountry: 0 } : {})
    }
    return trips.reduce((acc,trip)=> {
      if (trip.isEuTrip) acc['daysSpentInEU']+=trip.duration;
      if (trip.country!=='unitedKingdom') acc['daysSpentOutsideUK'] += trip.duration;
      if (acc['daysSpentOutsideHomeCountry'] && trip.country!==homeCountry) acc['daysSpentOutsideHomeCountry'] += trip.duration;
      return acc;
    }, daysSpentObject)

  }

}