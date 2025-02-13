import {Result, err, ok} from "neverthrow";
import {InsertUser, users} from "@/db/schema";
import {db} from "@/db/db";

export class UsersDAO {
  public static async upsertUser  (user: InsertUser): Promise<Result<number, Error>>  {
    try {
      const fullISODate = new Date().toISOString();
      const [newUser] = await db.insert(users)
        .values({
          ...user,
          updatedAt: fullISODate,
        })
        .onConflictDoUpdate({
          target: users.email,
          set: {
            name: user.name,
            profilePicture: user.profilePicture,
            updatedAt: fullISODate,
          },
        })
        .returning({id: users.id});
      if (!newUser) {
        return err(new Error("Failed to upsert user."));
      }
      return ok(newUser.id);
    } catch (error) {
      return err(new Error("Error upserting user: " + (error as Error).message));
    }
  };
}
