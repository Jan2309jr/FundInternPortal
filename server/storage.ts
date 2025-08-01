import { interns, donations, rewards, type Intern, type InsertIntern, type Donation, type InsertDonation, type Reward, type InsertReward } from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  getIntern(id: string): Promise<Intern | undefined>;
  getInternByEmail(email: string): Promise<Intern | undefined>;
  createIntern(intern: InsertIntern): Promise<Intern>;
  getAllInternsWithRankings(): Promise<(Intern & { rank: number })[]>;
  getInternDashboardData(internId: string): Promise<{
    intern: Intern;
    recentDonations: Donation[];
    rewards: Reward[];
  } | undefined>;
  createDummyData(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getIntern(id: string): Promise<Intern | undefined> {
    const [intern] = await db.select().from(interns).where(eq(interns.id, id));
    return intern || undefined;
  }

  async getInternByEmail(email: string): Promise<Intern | undefined> {
    const [intern] = await db.select().from(interns).where(eq(interns.email, email));
    return intern || undefined;
  }

  async createIntern(insertIntern: InsertIntern): Promise<Intern> {
    const [intern] = await db
      .insert(interns)
      .values(insertIntern)
      .returning();
    return intern;
  }

  async getAllInternsWithRankings(): Promise<(Intern & { rank: number })[]> {
    const internsWithRank = await db
      .select({
        id: interns.id,
        name: interns.name,
        email: interns.email,
        referralCode: interns.referralCode,
        totalRaised: interns.totalRaised,
        donationsCount: interns.donationsCount,
        createdAt: interns.createdAt,
        rank: sql<number>`ROW_NUMBER() OVER (ORDER BY ${interns.totalRaised} DESC)`.as('rank')
      })
      .from(interns)
      .orderBy(desc(interns.totalRaised));

    return internsWithRank;
  }

  async getInternDashboardData(internId: string): Promise<{
    intern: Intern;
    recentDonations: Donation[];
    rewards: Reward[];
  } | undefined> {
    const intern = await this.getIntern(internId);
    if (!intern) return undefined;

    const recentDonations = await db
      .select()
      .from(donations)
      .where(eq(donations.internId, internId))
      .orderBy(desc(donations.createdAt))
      .limit(5);

    const internRewards = await db
      .select()
      .from(rewards)
      .where(eq(rewards.internId, internId))
      .orderBy(desc(rewards.threshold));

    return {
      intern,
      recentDonations,
      rewards: internRewards,
    };
  }

  async createDummyData(): Promise<void> {
    // Check if data already exists
    const existingInterns = await db.select().from(interns).limit(1);
    if (existingInterns.length > 0) return;

    // Create sample interns
    const sampleInterns = [
      {
        name: "Emily Rodriguez",
        email: "emily@example.com",
        referralCode: "emily2025",
        totalRaised: 22500,
        donationsCount: 67,
      },
      {
        name: "Mike Chen",
        email: "mike@example.com",
        referralCode: "mike2025",
        totalRaised: 18200,
        donationsCount: 54,
      },
      {
        name: "Sarah Johnson",
        email: "sarah@example.com",
        referralCode: "sarah2025",
        totalRaised: 15750,
        donationsCount: 42,
      },
      {
        name: "Alex Kumar",
        email: "alex@example.com",
        referralCode: "alex2025",
        totalRaised: 14300,
        donationsCount: 38,
      },
      {
        name: "Jessica Park",
        email: "jessica@example.com",
        referralCode: "jessica2025",
        totalRaised: 12950,
        donationsCount: 31,
      },
    ];

    const createdInterns = await db.insert(interns).values(sampleInterns).returning();

    // Create sample donations for Sarah (our main user)
    const sarahIntern = createdInterns.find(i => i.email === "sarah@example.com");
    if (sarahIntern) {
      const sampleDonations = [
        {
          internId: sarahIntern.id,
          amount: 250,
          donorName: "Anonymous Donor",
        },
        {
          internId: sarahIntern.id,
          amount: 500,
          donorName: "John Smith",
        },
        {
          internId: sarahIntern.id,
          amount: 100,
          donorName: "Anonymous Donor",
        },
      ];

      await db.insert(donations).values(sampleDonations);

      // Create sample rewards for Sarah
      const sampleRewards = [
        {
          internId: sarahIntern.id,
          rewardType: "milestone",
          title: "First Milestone",
          description: "$10,000 raised",
          threshold: 10000,
          unlocked: 1,
        },
        {
          internId: sarahIntern.id,
          rewardType: "performance",
          title: "Top Performer",
          description: "Top 5 ranking",
          threshold: 15000,
          unlocked: 1,
        },
        {
          internId: sarahIntern.id,
          rewardType: "achievement",
          title: "Champion",
          description: "$25,000 raised",
          threshold: 25000,
          unlocked: 0,
        },
      ];

      await db.insert(rewards).values(sampleRewards);
    }
  }
}

export const storage = new DatabaseStorage();
