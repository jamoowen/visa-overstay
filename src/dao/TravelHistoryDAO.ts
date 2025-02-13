import {Result, err, ok} from "neverthrow";
import {InsertTrip, SelectTrip, travelHistory} from "@/db/schema";
import {db} from "@/db/db";
import {eq} from "drizzle-orm";

export class TravelHistoryDAO {
  public static async insertTrip(trip: InsertTrip): Promise<Result<void, Error>> {
    try {
      const result = await db.insert(travelHistory)
        .values(trip)
      return ok(undefined);
    } catch (error) {
      return err(new Error(`Error inserting trip: ${error}`));
    }
  }

  public static async getTrips(userId:number): Promise<Result<SelectTrip[], Error>> {
    try {
      const trips = await db.select()
        .from(travelHistory)
        .where(eq(travelHistory.userId, userId));
      return ok(trips);
    } catch (error) {
      return err(new Error(`Error getting trips for user: ${userId}: ${error}`));
    }
  };
}
