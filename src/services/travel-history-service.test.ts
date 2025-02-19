import {TravelHistoryService} from "./travel-history-service";
import {SelectTrip} from "@/db/schema";
import {describe, it, expect, test} from "@jest/globals";
import {worldCountries} from "public/data/world-countries"

describe("TravelHistoryService", () => {
  describe("dateDifferenceInDays", () => {
    it("should return the correct number of days between two dates", () => {
      const olderDate = new Date("2024-01-01");
      const newerDate = new Date("2024-01-10");
      const result = TravelHistoryService.dateDifferenceInDays(olderDate, newerDate);
      expect(result).toBe(9); // 10 - 1 = 9 days
    });
    it("should return a negative value if the older date is after the newer date", () => {
      const olderDate = new Date("2024-01-10");
      const newerDate = new Date("2024-01-01");
      const result = TravelHistoryService.dateDifferenceInDays(olderDate, newerDate);
      expect(result).toBe(-9);
    });

    it("should return 0 if the dates are the same", () => {
      const date = new Date("2024-01-01");
      const result = TravelHistoryService.dateDifferenceInDays(date, date);
      expect(result).toBe(0);
    });
  });

  describe("calculateDurationOfAllTrips", () => {
    it("should calculate the duration between consecutive trips", async () => {
      const userId = 1;
      const allTrips: SelectTrip[] = [
        getTrip('uk', '2024-01-01'),
        getTrip('uk', '2024-01-10'),
        getTrip('uk', '2024-01-20'),
      ];
      const result = await TravelHistoryService.calculateDurationOfAllTrips(userId, allTrips);

      expect(result).toEqual([
        {...allTrips[0], duration: 9}, // Jan 1 -> Jan 10
        {...allTrips[1], duration: 10}, // Jan 10 -> Jan 20
        {...allTrips[2]}, // Last trip should have no duration field
      ]);
    });

    it("should return an empty array if there are no trips", async () => {
      const result = await TravelHistoryService.calculateDurationOfAllTrips(1, []);
      expect(result).toEqual([]);
    });

    it("should return the trip unchanged if there's only one trip", async () => {
      const singleTrip: SelectTrip[] = [
        getTrip('uk','2024-01-01')
      ];
      const result = await TravelHistoryService.calculateDurationOfAllTrips(1, singleTrip);
      expect(result).toEqual(singleTrip);
    });
  });
});


function getTrip(country: string, arrivalDate: string, userId?: number): SelectTrip {
  return {
    id: Math.random(),
    userId: userId ?? 1,
    country: country,
    arrivalDate: arrivalDate,
    updatedAt: new Date(),
    departureDate: null
  }
}