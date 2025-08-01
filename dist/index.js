

var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path"; // Ensure path is imported
import { fileURLToPath } from "url"; // Import fileURLToPath

// Define __filename and __dirname within this ES module's scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  donations: () => donations,
  insertDonationSchema: () => insertDonationSchema,
  insertInternSchema: () => insertInternSchema,
  insertRewardSchema: () => insertRewardSchema,
  interns: () => interns,
  rewards: () => rewards
});
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var interns = pgTable("interns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  referralCode: text("referral_code").notNull().unique(),
  totalRaised: integer("total_raised").notNull().default(0),
  donationsCount: integer("donations_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow()
});
var donations = pgTable("donations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  internId: varchar("intern_id").notNull().references(() => interns.id),
  amount: integer("amount").notNull(),
  donorName: text("donor_name"),
  createdAt: timestamp("created_at").defaultNow()
});
var rewards = pgTable("rewards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  internId: varchar("intern_id").notNull().references(() => interns.id),
  rewardType: text("reward_type").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  threshold: integer("threshold").notNull(),
  unlocked: integer("unlocked").notNull().default(0),
  // 0 = locked, 1 = unlocked
  createdAt: timestamp("created_at").defaultNow()
});
var insertInternSchema = createInsertSchema(interns).omit({
  id: true,
  createdAt: true
});
var insertDonationSchema = createInsertSchema(donations).omit({
  id: true,
  createdAt: true
});
var insertRewardSchema = createInsertSchema(rewards).omit({
  id: true,
  createdAt: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, desc, sql as sql2 } from "drizzle-orm";
var DatabaseStorage = class {
  async getIntern(id) {
    const [intern] = await db.select().from(interns).where(eq(interns.id, id));
    return intern || void 0;
  }
  async getInternByEmail(email) {
    const [intern] = await db.select().from(interns).where(eq(interns.email, email));
    return intern || void 0;
  }
  async createIntern(insertIntern) {
    const [intern] = await db.insert(interns).values(insertIntern).returning();
    return intern;
  }
  async getAllInternsWithRankings() {
    const internsWithRank = await db.select({
      id: interns.id,
      name: interns.name,
      email: interns.email,
      referralCode: interns.referralCode,
      totalRaised: interns.totalRaised,
      donationsCount: interns.donationsCount,
      createdAt: interns.createdAt,
      rank: sql2`ROW_NUMBER() OVER (ORDER BY ${interns.totalRaised} DESC)`.as("rank")
    }).from(interns).orderBy(desc(interns.totalRaised));
    return internsWithRank;
  }
  async getInternDashboardData(internId) {
    const intern = await this.getIntern(internId);
    if (!intern) return void 0;
    const recentDonations = await db.select().from(donations).where(eq(donations.internId, internId)).orderBy(desc(donations.createdAt)).limit(5);
    const internRewards = await db.select().from(rewards).where(eq(rewards.internId, internId)).orderBy(desc(rewards.threshold));
    return {
      intern,
      recentDonations,
      rewards: internRewards
    };
  }
  async createDummyData() {
    const existingInterns = await db.select().from(interns).limit(1);
    if (existingInterns.length > 0) return;
    const sampleInterns = [
      {
        name: "Emily Rodriguez",
        email: "emily@example.com",
        referralCode: "emily2025",
        totalRaised: 22500,
        donationsCount: 67
      },
      {
        name: "Mike Chen",
        email: "mike@example.com",
        referralCode: "mike2025",
        totalRaised: 18200,
        donationsCount: 54
      },
      {
        name: "Sarah Johnson",
        email: "sarah@example.com",
        referralCode: "sarah2025",
        totalRaised: 15750,
        donationsCount: 42
      },
      {
        name: "Alex Kumar",
        email: "alex@example.com",
        referralCode: "alex2025",
        totalRaised: 14300,
        donationsCount: 38
      },
      {
        name: "Jessica Park",
        email: "jessica@example.com",
        referralCode: "jessica2025",
        totalRaised: 12950,
        donationsCount: 31
      }
    ];
    const createdInterns = await db.insert(interns).values(sampleInterns).returning();
    const sarahIntern = createdInterns.find((i) => i.email === "sarah@example.com");
    if (sarahIntern) {
      const sampleDonations = [
        {
          internId: sarahIntern.id,
          amount: 250,
          donorName: "Anonymous Donor"
        },
        {
          internId: sarahIntern.id,
          amount: 500,
          donorName: "John Smith"
        },
        {
          internId: sarahIntern.id,
          amount: 100,
          donorName: "Anonymous Donor"
        }
      ];
      await db.insert(donations).values(sampleDonations);
      const sampleRewards = [
        {
          internId: sarahIntern.id,
          rewardType: "milestone",
          title: "First Milestone",
          description: "$10,000 raised",
          threshold: 1e4,
          unlocked: 1
        },
        {
          internId: sarahIntern.id,
          rewardType: "performance",
          title: "Top Performer",
          description: "Top 5 ranking",
          threshold: 15e3,
          unlocked: 1
        },
        {
          internId: sarahIntern.id,
          rewardType: "achievement",
          title: "Champion",
          description: "$25,000 raised",
          threshold: 25e3,
          unlocked: 0
        }
      ];
      await db.insert(rewards).values(sampleRewards);
    }
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
import { z } from "zod";
async function registerRoutes(app2) {
  await storage.createDummyData();
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      const intern = await storage.getInternByEmail(email);
      if (!intern) {
        return res.status(404).json({ message: "Intern not found" });
      }
      res.json({
        success: true,
        intern: {
          id: intern.id,
          name: intern.name,
          email: intern.email,
          referralCode: intern.referralCode
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/auth/signup", async (req, res) => {
    try {
      const validatedData = insertInternSchema.parse(req.body);
      const existingIntern = await storage.getInternByEmail(validatedData.email);
      if (existingIntern) {
        return res.status(400).json({ message: "Email already registered" });
      }
      const intern = await storage.createIntern(validatedData);
      res.status(201).json({
        success: true,
        intern: {
          id: intern.id,
          name: intern.name,
          email: intern.email,
          referralCode: intern.referralCode
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/dashboard/:internId", async (req, res) => {
    try {
      const { internId } = req.params;
      const dashboardData = await storage.getInternDashboardData(internId);
      if (!dashboardData) {
        return res.status(404).json({ message: "Intern not found" });
      }
      const allInterns = await storage.getAllInternsWithRankings();
      const currentIntern = allInterns.find((i) => i.id === internId);
      const rank = currentIntern?.rank || 0;
      res.json({
        ...dashboardData,
        rank
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/leaderboard", async (req, res) => {
    try {
      const leaderboard = await storage.getAllInternsWithRankings();
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/interns/by-email/:email", async (req, res) => {
    try {
      const { email } = req.params;
      const intern = await storage.getInternByEmail(email);
      if (!intern) {
        return res.status(404).json({ message: "Intern not found" });
      }
      res.json({
        id: intern.id,
        name: intern.name,
        email: intern.email,
        referralCode: intern.referralCode
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
export default defineConfig({
  plugins: [
    react()
    // 🔥 Removed Replit-only plugins
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
