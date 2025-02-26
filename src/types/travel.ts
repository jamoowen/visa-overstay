import {WorldCountries} from "@/data/world-countries";


export type WorldCountryKey = keyof typeof WorldCountries;

export type WorldCountry = {
  name: string,
  continent: string,
  eu: boolean
};

export type WorldCountriesMap = Record<WorldCountryKey, WorldCountry>;


export type EnrichedTrip = {
  country: WorldCountryKey;
  countryName: string;
  arrivalDate: string;
  duration: number;
  isEuTrip: boolean;
  continent: string;
}

export type DaysSpentTravelling = {
  daysSpentInEU: number;
  daysSpentOutsideUK: number;
  daysSpentOutsideHomeCountry?: number;
}