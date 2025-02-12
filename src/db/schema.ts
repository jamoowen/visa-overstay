import { integer, pgTable, serial, text, timestamp, date } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  profilePicture: text('profile_picture'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: date("updated_at").defaultNow().notNull()
});

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export const travelHistory = pgTable('travel_history', {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  country: text('country').notNull(),
  arrivalDate: date("arrival_date").notNull(),
  departureDate: date("departure_date"),
  updatedAt: date("updated_at").defaultNow().notNull()
});

export type InsertToDo = typeof travelHistory.$inferInsert;
export type SelectToDo = typeof travelHistory.$inferSelect;