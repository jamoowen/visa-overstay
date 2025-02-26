import {SelectTrip} from "@/db/schema";
import {describe, it, expect, test} from "@jest/globals";
import {WorldCountries} from "@/data/world-countries"
import {tripCountryIsNotTheSameAsPreviousOrFollowingTrip} from "./validation";

describe("Validation functions", () => {
  describe("tripCountryIsNotTheSameAsPreviousOrFollowingTrip", () => {
    const travelHistory: SelectTrip[] = [
      {
        id: 15,
        userId: 1,
        country: "unitedKingdom",
        arrivalDate: "2025-02-03",
        departureDate: "",
        updatedAt: new Date("2025-02-21")
      },
      {
        id: 9,
        userId: 1,
        country: "southAfrica",
        arrivalDate: "2024-12-28",
        departureDate: "",
        updatedAt: new Date("2025-02-18")
      },
      {
        id: 18,
        userId: 1,
        country: "unitedKingdom",
        arrivalDate: "2024-07-24",
        departureDate: "",
        updatedAt: new Date("2025-02-21")
      },
      {
        id: 31,
        userId: 1,
        country: "switzerland",
        arrivalDate: "2024-06-28",
        departureDate: "",
        updatedAt: new Date("2025-02-25")
      },
      {
        id: 32,
        userId: 1,
        country: "greece",
        arrivalDate: "2024-06-15",
        departureDate: "",
        updatedAt: new Date("2025-02-25")
      },
      {
        id: 33,
        userId: 1,
        country: "portugal",
        arrivalDate: "2024-05-30",
        departureDate: "",
        updatedAt: new Date("2025-02-25")
      }
    ];
    it("Should return false if a new trip is the same country as an adjacent trip arrival date wise", () => {
      const newTrip = {
        country: "unitedKingdom",
        arrivalDate: new Date("2024-12-30")
      } 
      const result  = tripCountryIsNotTheSameAsPreviousOrFollowingTrip(newTrip, travelHistory)
      expect(result).toBe(false);
    });
    it("Should return true if a new trip is not adjacent", () => {
      const newTrip = {
        country: "unitedKingdom",
        arrivalDate: new Date("2024-06-03")
      }
      const result  = tripCountryIsNotTheSameAsPreviousOrFollowingTrip(newTrip, travelHistory)
      expect(result).toBe(true);
    });
  });
});