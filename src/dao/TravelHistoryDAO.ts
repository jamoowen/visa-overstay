import {Result, err, ok} from "neverthrow";
import {InsertTrip, SelectTrip, travelHistory} from "@/db/schema";
import {db} from "@/db/db";
import {asc, desc, eq, and} from "drizzle-orm";

export class TravelHistoryDAO {
  public static async getTrips(userId:number): Promise<Result<SelectTrip[], Error>> {
    console.log(`getting trips for ${userId}`);
    try {
      const trips = await db.select()
        .from(travelHistory)
        .where(eq(travelHistory.userId, userId))
        .orderBy(desc(travelHistory.arrivalDate))
      ;
      return ok(trips);
    } catch (error) {
      console.error(`Failed to get trips for user: ${userId}: ${error}`);
      return err(new Error(`Failed to get trips`));
    }
  };

  public static async insertTrip(trip: InsertTrip): Promise<Result<void, Error>> {
    const currentTime = new Date();
    try {
      const result = await db.insert(travelHistory)
        .values({
          ...trip,
          updatedAt: currentTime
        })
      return ok(undefined);
    } catch (error) {
      console.error(`Error inserting trip ${JSON.stringify(trip)}: ${error}`)
      return err(new Error(`Failed to insert trip inserting trip`));
    }
  }
  public static async deleteTrip(userId: number, arrivalDate: string): Promise<Result<void, Error>> {
    try {
      console.log(`deleteing for user ${userId} for arrivalDate: ${arrivalDate}`);
      const result = await db.delete(travelHistory)
        .where(and(eq(travelHistory.userId, userId), eq(travelHistory.arrivalDate, arrivalDate)));
      if (result.rowCount <1) {
        return err(new Error(`Failed to delete trip with id ${userId}`));
      }
      return ok(undefined);
    } catch (error) {
      console.error(`Failed to delete trip: ${arrivalDate} for user: ${userId}: ${error}`)
      return err(new Error(`Failed to delete trip${arrivalDate} `));
    }
  }
}
