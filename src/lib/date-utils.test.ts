import { SelectTrip } from "@/db/schema";
import { describe, it, expect, test } from "@jest/globals";
import { WorldCountries } from "@/data/world-countries"
import { tripCountryIsNotTheSameAsPreviousOrFollowingTrip } from "./validation";
import { DateUtils } from "@/lib/date-utils";

describe("Date utils", () => {
  describe("absoluteDateDifferenceInDays", () => {
    it("should return the correct number of days between two dates", () => {
      const olderDate = new Date("2024-01-01");
      const newerDate = new Date("2024-01-10");
      const result = DateUtils.calculateAbsoluteDateDifferenceInDays(olderDate, newerDate);
      expect(result).toBe(9); // 10 - 1 = 9 days
    });
    it("should return a negative value if the older date is after the newer date", () => {
      const olderDate = new Date("2024-01-10");
      const newerDate = new Date("2024-01-01");
      const result = DateUtils.calculateAbsoluteDateDifferenceInDays(olderDate, newerDate);
      expect(result).toBe(9);
    });

    it("should return 0 if the dates are the same", () => {
      const date = new Date("2024-01-01");
      const result = DateUtils.calculateAbsoluteDateDifferenceInDays(date, date);
      expect(result).toBe(0);
    });
  });
});