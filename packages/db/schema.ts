import { pgTable, text, timestamp, boolean, doublePrecision } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()), // We will use uuid or string ids
  googleSub: text('google_sub').notNull().unique(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  avatarUrl: text('avatar_url'),
  homeLat: doublePrecision('home_lat'),
  homeLng: doublePrecision('home_lng'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const trustedContacts = pgTable('trusted_contacts', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
});

export const alerts = pgTable('alerts', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  lat: doublePrecision('lat').notNull(),
  lng: doublePrecision('lng').notNull(),
  status: text('status').notNull().default('active'), // active, resolved
  createdAt: timestamp('created_at').defaultNow().notNull(),
  resolvedAt: timestamp('resolved_at'),
});

export const safePoints = pgTable('safe_points', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  type: text('type').notNull(), // shop, guard-booth, pharmacy, hostel-warden
  lat: doublePrecision('lat').notNull(),
  lng: doublePrecision('lng').notNull(),
  verified: boolean('verified').notNull().default(true),
});
