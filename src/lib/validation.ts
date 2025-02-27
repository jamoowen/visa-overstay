// someone cant have the same country as the adjacent arrivalDate
import {SelectTrip} from "@/db/schema";

export const tripCountryIsNotTheSameAsPreviousOrFollowingTrip = (data: { country: string, arrivalDate: Date, departureDate?: Date | undefined }, travelHistory: SelectTrip[]) => {
  if (travelHistory.length === 0) {
    return true;
  }
  if (travelHistory.length === 1) {
    return data.country !== travelHistory[0].country;
  }
  for (let i = 0; i < travelHistory.length; i++) {
    // travelHistory is sorted descending
    // if the trip we are inserting is more recent then check if its neightbours are the same country
    if (data.arrivalDate.getTime() > (new Date(travelHistory[i].arrivalDate)).getTime()) {
      if (travelHistory[i].country === data.country) {
        return false
      }
      if (i !== 0 && travelHistory[i - 1].country === data.country) {
        return false
      }
      return true
    }
  }
  if (travelHistory[travelHistory.length-1].country === data.country) {
    return false
  }
  return true
}