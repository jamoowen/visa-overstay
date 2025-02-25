import {TravelHistoryService} from "./travel-history-service";
import {SelectTrip} from "@/db/schema";
import {describe, it, expect, test} from "@jest/globals";
import {WorldCountryKey} from "@/types/travel";

describe("TravelHistoryService", () => {
  describe("absoluteDateDifferenceInDays", () => {
    it("should return the correct number of days between two dates", () => {
      const olderDate = new Date("2024-01-01");
      const newerDate = new Date("2024-01-10");
      const result = TravelHistoryService.absoluteDateDifferenceInDays(olderDate, newerDate);
      expect(result).toBe(9); // 10 - 1 = 9 days
    });
    it("should return a negative value if the older date is after the newer date", () => {
      const olderDate = new Date("2024-01-10");
      const newerDate = new Date("2024-01-01");
      const result = TravelHistoryService.absoluteDateDifferenceInDays(olderDate, newerDate);
      expect(result).toBe(9);
    });

    it("should return 0 if the dates are the same", () => {
      const date = new Date("2024-01-01");
      const result = TravelHistoryService.absoluteDateDifferenceInDays(date, date);
      expect(result).toBe(0);
    });
  });

  describe("calculateDurationOfAllTrips", () => {
    it("should calculate the duration between consecutive trips", async () => {
      const allTrips: SelectTrip[] = [
        getTrip('unitedKingdom', '2024-03-30'),
        getTrip('serbia', '2024-03-01'),
        getTrip('albania', '2024-01-20'),
      ];
      const result =  TravelHistoryService.enrichTripsWithCountryAndDurationData(allTrips);
      expect(result[1].duration).toBe(29);
    });

    it("should return an empty array if there are no trips", async () => {
      const result = TravelHistoryService.enrichTripsWithCountryAndDurationData([]);
      expect(result).toEqual([]);
    });

  });
});


function getTrip(country: WorldCountryKey, arrivalDate: string, userId?: number): SelectTrip {
  return {
    id: Math.random(),
    userId: userId ?? 1,
    country: country,
    arrivalDate: arrivalDate,
    updatedAt: new Date(),
    departureDate: null
  }
}