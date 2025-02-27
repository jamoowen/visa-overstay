import { WorldCountries } from "@/data/world-countries";


export type WorldCountryKey = keyof typeof WorldCountries;

export type WorldCountry = {
  name: string,
  continent: string,
  eu: boolean
};

export type WorldCountriesMap = Record<WorldCountryKey, WorldCountry>;

export type CountryOption = {
  key: WorldCountryKey;
  name: string;
}

export type EnrichedTrip = {
  country: WorldCountryKey;
  countryName: string;
  arrivalDate: string;
  duration: number;
  isEuTrip: boolean;
  continent: string;
}


export type CutoffPeriod = { days: number } | { months: number };


export type DaysSpentTravelling = {
  daysSpentInsideEU: number;
  daysSpentOutsideEU: number;
  daysSpentInsideUK: number;
  daysSpentOutsideUK: number;
  daysSpentInsideHomeCountry?: number;
  daysSpentOutsideHomeCountry?: number;
}

export type DaysSpentTravellingForPeriods =
  Record<"travelHistoryForPastTwelveMonths" | "travelHistoryForPast180Days", DaysSpentTravelling>
  | null