import { SelectTrip } from "@/db/schema";
import { WorldCountries } from "@/data/world-countries.js";
import { CutoffPeriod, DaysSpentTravelling, EnrichedTrip, WorldCountryKey } from "@/types/travel";
import { DateUtils } from "@/lib/date-utils";

export interface TravelHistoryProcessor {
  enrichTripsWithCountryAndDurationData(allTrips: SelectTrip[]): EnrichedTrip[];

  cutoffTripsAtGivenPeriod(today: Date, cutoff: CutoffPeriod, trips: EnrichedTrip[]): EnrichedTrip[];

  calculateDaysSpentTravelling(cutoffPeriodInDays: number, trips: EnrichedTrip[], homeCountry?: WorldCountryKey): DaysSpentTravelling;
}

export class TravelHistoryService implements TravelHistoryProcessor {
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

  public cutoffTripsAtGivenPeriod(today: Date, cutoff: CutoffPeriod, trips: EnrichedTrip[]): EnrichedTrip[] {
    const currentYMD = DateUtils.getFloorOfDate(today);
    const dateWithTimeSubtracted = 'months' in cutoff
      ? DateUtils.addMonthsToDate(new Date(currentYMD), - cutoff.months)
      : DateUtils.addDaysToDate(new Date(currentYMD), - cutoff.days)

    const modifiedTrips: EnrichedTrip[] = [];
    for (let i = 0; i < trips.length; i++) {
      const arrivalDate = new Date(trips[i].arrivalDate);
      if (arrivalDate.getTime() >= dateWithTimeSubtracted.getTime()) {
        modifiedTrips.push(trips[i]);
        continue;
      }
      const dateDiffInDays = DateUtils.calculateAbsoluteDateDifferenceInDays(arrivalDate, dateWithTimeSubtracted);
      modifiedTrips.push({
        ...trips[i],
        duration: trips[i].duration-dateDiffInDays-1,
      })
      break;
    }
    return modifiedTrips;
  }

  public calculateDaysSpentTravelling(cutoffPeriodInDays: number, trips: EnrichedTrip[], homeCountry?: WorldCountryKey): DaysSpentTravelling {
    const daysSpentObject: DaysSpentTravelling = {
      daysSpentInsideEU: 0,
      daysSpentOutsideEU: 0,
      daysSpentInsideUK: 0,
      daysSpentOutsideUK: 0,
      ...(homeCountry ? { daysSpentInsideHomeCountry: 0 } : {}),
      ...(homeCountry ? { daysSpentOutsideHomeCountry: 0 } : {}),
    }
    if (!trips || !trips.length) return daysSpentObject;
    const daysSpentTravelling = trips.reduce((acc, trip) => {
      if (trip.isEuTrip) acc.daysSpentInsideEU += trip.duration;
      if (trip.country === 'unitedKingdom') acc.daysSpentInsideUK += trip.duration;
      if (acc.daysSpentInsideHomeCountry != null && trip.country === homeCountry) acc.daysSpentInsideHomeCountry += trip.duration;
      return acc;
    }, daysSpentObject);
    
    daysSpentTravelling.daysSpentOutsideEU = cutoffPeriodInDays - daysSpentTravelling.daysSpentInsideEU;
    daysSpentTravelling.daysSpentOutsideUK = cutoffPeriodInDays - daysSpentTravelling.daysSpentInsideUK;
    
    if (daysSpentTravelling.daysSpentInsideHomeCountry != null && daysSpentTravelling.daysSpentOutsideHomeCountry != null) {
      daysSpentTravelling.daysSpentOutsideHomeCountry = cutoffPeriodInDays - daysSpentTravelling.daysSpentInsideHomeCountry
    }
    return daysSpentTravelling;
  }

}