import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  jsonb,
  boolean,
  customType,
} from "drizzle-orm/pg-core";

// Custom pgvector type definition for vector embeddings
export const vector = customType<{
  data: number[];
  driverData: string;
  config: { dimensions?: number };
}>({
  dataType(config) {
    const dimensions = config?.dimensions ?? 1536;
    return `vector(${dimensions})`;
  },
  toDriver(value: number[]): string {
    return JSON.stringify(value);
  },
  fromDriver(value: string): number[] {
    return JSON.parse(value);
  },
});

export const tenants = pgTable("tenants", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id")
    .references(() => tenants.id, { onDelete: "cascade" })
    .notNull(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").default("member").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sources = pgTable("sources", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id")
    .references(() => tenants.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  adapterType: text("adapter_type").notNull(),
  url: text("url").notNull(),
  status: text("status").default("active").notNull(),
  pollingIntervalSeconds: integer("polling_interval_seconds")
    .default(3600)
    .notNull(),
  lastPolledAt: timestamp("last_polled_at"),
  metadata: jsonb("metadata").default({}).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const knowledgeItems = pgTable("knowledge_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id")
    .references(() => tenants.id, { onDelete: "cascade" })
    .notNull(),
  sourceId: uuid("source_id").references(() => sources.id, {
    onDelete: "set null",
  }),
  externalId: text("external_id"),
  title: text("title").notNull(),
  content: text("content").notNull(),
  contentType: text("content_type").default("article").notNull(),
  url: text("url").notNull(),
  author: text("author"),
  publishedAt: timestamp("published_at"),
  confidenceScore: integer("confidence_score").default(100).notNull(),
  verificationStatus: text("verification_status")
    .default("unverified")
    .notNull(),
  tags: jsonb("tags").default([]).notNull(),
  embedding: vector("embedding", { dimensions: 1536 }),
  metadata: jsonb("metadata").default({}).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const briefings = pgTable("briefings", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id")
    .references(() => tenants.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  readStatus: text("read_status").default("unread").notNull(),
  metadata: jsonb("metadata").default({}).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const agents = pgTable("agents", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id")
    .references(() => tenants.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  status: text("status").default("idle").notNull(),
  capabilities: jsonb("capabilities").default([]).notNull(),
  lastActiveAt: timestamp("last_active_at"),
  metadata: jsonb("metadata").default({}).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, {
    onDelete: "cascade",
  }),
  action: text("action").notNull(),
  actor: text("actor").notNull(),
  payload: jsonb("payload").default({}).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
