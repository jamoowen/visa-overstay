"use client";


import { CountryOption, DaysSpentTravellingForPeriods, WorldCountryKey } from "@/types/travel";


export function DaysSpentTravellingOverview({ daysSpentTravelling, homeCountry }: { daysSpentTravelling: DaysSpentTravellingForPeriods, homeCountry: CountryOption | null }) {

  if (daysSpentTravelling == null) return null;
  return (
    <div className="grid grid-cols-2 space-x-2">
      <div className="border border-white rounded-xl p-2">
        <h3 className="font-bold">Last 180 days</h3>
        <ul className="text-sm py-2">
          <li>
            Spent IN UK: {daysSpentTravelling.travelHistoryForPast180Days.daysSpentInsideUK}
          </li>
          <li>
            Spent OUT of UK: {daysSpentTravelling.travelHistoryForPast180Days.daysSpentOutsideUK}
          </li>
        </ul>
        <ul className="text-sm py-2">
          <li>
            Spent IN the EU: {daysSpentTravelling.travelHistoryForPast180Days.daysSpentInsideEU}
          </li>
          <li>
            Spent OUT of the EU: {daysSpentTravelling.travelHistoryForPast180Days.daysSpentOutsideEU}
          </li>
        </ul>
        <ul className="text-sm py-2">
          <li>
            {"daysSpentInsideHomeCountry" in daysSpentTravelling.travelHistoryForPast180Days
              && homeCountry
              && <>Spent IN {homeCountry.name}: {daysSpentTravelling.travelHistoryForPast180Days.daysSpentInsideHomeCountry}</>
            }
          </li>
          <li>
            {"daysSpentOutsideHomeCountry" in daysSpentTravelling.travelHistoryForPast180Days
              && homeCountry
              && <>Spent OUT of {homeCountry.name}: {daysSpentTravelling.travelHistoryForPast180Days.daysSpentOutsideHomeCountry}</>
            }
          </li>
        </ul>
      </div>
      <div className="border border-white rounded-xl p-2">
        <h3 className="font-bold">Last 12 Months</h3>
        <ul className="text-sm py-2">
          <li>
            Spent IN UK: {daysSpentTravelling.travelHistoryForPastTwelveMonths.daysSpentInsideUK}
          </li>
          <li>
            Spent OUT of UK: {daysSpentTravelling.travelHistoryForPastTwelveMonths.daysSpentOutsideUK}
          </li>
        </ul>
        <ul className="text-sm py-2">
          <li>
            Spent IN the EU: {daysSpentTravelling.travelHistoryForPastTwelveMonths.daysSpentInsideEU}
          </li>
          <li>
            Spent OUT of the EU: {daysSpentTravelling.travelHistoryForPastTwelveMonths.daysSpentOutsideEU}
          </li>
        </ul>
        <ul className="text-sm py-2">
          <li>
            {"daysSpentInsideHomeCountry" in daysSpentTravelling.travelHistoryForPastTwelveMonths
              && homeCountry
              && <>Spent IN {homeCountry.name}: {daysSpentTravelling.travelHistoryForPastTwelveMonths.daysSpentInsideHomeCountry}</>
            }
          </li>
          <li>
            {"daysSpentOutsideHomeCountry" in daysSpentTravelling.travelHistoryForPastTwelveMonths
              && homeCountry
              && <>Spent OUT of {homeCountry.name}: {daysSpentTravelling.travelHistoryForPastTwelveMonths.daysSpentOutsideHomeCountry}</>
            }
          </li>
        </ul>
      </div>
    </div>
  );
}

export default DaysSpentTravellingOverview;
