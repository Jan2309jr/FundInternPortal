import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const interns = pgTable("interns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  referralCode: text("referral_code").notNull().unique(),
  totalRaised: integer("total_raised").notNull().default(0),
  donationsCount: integer("donations_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const donations = pgTable("donations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  internId: varchar("intern_id").notNull().references(() => interns.id),
  amount: integer("amount").notNull(),
  donorName: text("donor_name"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const rewards = pgTable("rewards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  internId: varchar("intern_id").notNull().references(() => interns.id),
  rewardType: text("reward_type").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  threshold: integer("threshold").notNull(),
  unlocked: integer("unlocked").notNull().default(0), // 0 = locked, 1 = unlocked
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertInternSchema = createInsertSchema(interns).omit({
  id: true,
  createdAt: true,
});

export const insertDonationSchema = createInsertSchema(donations).omit({
  id: true,
  createdAt: true,
});

export const insertRewardSchema = createInsertSchema(rewards).omit({
  id: true,
  createdAt: true,
});

export type InsertIntern = z.infer<typeof insertInternSchema>;
export type Intern = typeof interns.$inferSelect;
export type InsertDonation = z.infer<typeof insertDonationSchema>;
export type Donation = typeof donations.$inferSelect;
export type InsertReward = z.infer<typeof insertRewardSchema>;
export type Reward = typeof rewards.$inferSelect;
