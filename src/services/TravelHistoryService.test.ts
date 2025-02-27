import {TravelHistoryService} from "./TravelHistoryService";
import {SelectTrip} from "@/db/schema";
import {describe, it, expect, test} from "@jest/globals";
import {WorldCountryKey} from "@/types/travel";
import { DateUtils } from "@/lib/date-utils";

describe("TravelHistoryService", () => {
  const service = new TravelHistoryService();

  describe("calculateDurationOfAllTrips", () => {
    it("should calculate the duration between consecutive trips", async () => {
      const allTrips: SelectTrip[] = [
        getTrip('unitedKingdom', '2024-03-30'),
        getTrip('serbia', '2024-03-01'),
        getTrip('albania', '2024-01-20'),
      ];
      const result =  service.enrichTripsWithCountryAndDurationData(allTrips);
      expect(result[1].duration).toBe(29);
    });
    it("should return an empty array if there are no trips", async () => {
      const result = service.enrichTripsWithCountryAndDurationData([]);
      expect(result).toEqual([]);
    });
  });
  describe("cutoffTripsAtTwelveMonths", () => {
    it("Should return all trips if they took place in the last year", async () => {
      const today = DateUtils.getFloorOfDate(new Date());
      const allTrips: SelectTrip[] = [
        getTrip('unitedKingdom', DateUtils.formatDateAsYMD(DateUtils.addDaysToDate(today, -90))),
        getTrip('serbia',DateUtils.formatDateAsYMD(DateUtils.addDaysToDate(today, -180))),
        getTrip('albania',DateUtils.formatDateAsYMD(DateUtils.addDaysToDate(today, -360))),
      ];
      const enrichedTrips =  service.enrichTripsWithCountryAndDurationData(allTrips);
      const cutoffTrips= service.cutoffTripsAtTwelveMonths(today,enrichedTrips);
      expect(cutoffTrips).toEqual(enrichedTrips);
    });
    it("Should cutoff the duration of a trip at 12 months if it is older than that", async () => {
      const today = new Date('2024-01-01')
      const allTrips: SelectTrip[] = [
        getTrip('unitedKingdom', DateUtils.formatDateAsYMD(DateUtils.addMonthsToDate(today, -3))),
        getTrip('serbia',DateUtils.formatDateAsYMD(DateUtils.addMonthsToDate(today, -11))),
        getTrip('albania',DateUtils.formatDateAsYMD(DateUtils.addMonthsToDate(today, -13))),
      ];
      const enrichedTrips =  service.enrichTripsWithCountryAndDurationData(allTrips);
      const cutoffTrips= service.cutoffTripsAtTwelveMonths(today, enrichedTrips);
      expect(cutoffTrips[2].duration).toEqual(31);
    });
    it("should return an empty array if there are no trips", async () => {
      const cutoffTrips= service.cutoffTripsAtTwelveMonths(new Date, []);
      expect(cutoffTrips).toEqual([]);
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