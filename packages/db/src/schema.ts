// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { index, pgTableCreator } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `pws-base_${name}`);

export const users = createTable(
	"user",
	(d) => ({
		id: d.text().primaryKey(),
		email: d.text().notNull().unique(),
		emailVerified: d.boolean().notNull().default(false),
		name: d.text(),
		image: d.text(),
		createdAt: d
			.timestamp({ withTimezone: true })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
	}),
	(t) => [index("user_email_idx").on(t.email)],
);

export const sessions = createTable(
	"session",
	(d) => ({
		id: d.text().primaryKey(),
		userId: d
			.text()
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		token: d.text().notNull().unique(),
		expiresAt: d.timestamp({ withTimezone: true }).notNull(),
		ipAddress: d.text(),
		userAgent: d.text(),
		createdAt: d
			.timestamp({ withTimezone: true })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
	}),
	(t) => [index("session_user_id_idx").on(t.userId)],
);

export const accounts = createTable(
	"account",
	(d) => ({
		id: d.text().primaryKey(),
		userId: d
			.text()
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		accountId: d.text().notNull(),
		providerId: d.text().notNull(),
		password: d.text(),
		accessToken: d.text(),
		refreshToken: d.text(),
		expiresAt: d.timestamp({ withTimezone: true }),
		createdAt: d
			.timestamp({ withTimezone: true })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
	}),
	(t) => [
		index("account_user_id_idx").on(t.userId),
		index("account_provider_idx").on(t.providerId, t.accountId),
	],
);

export const verifications = createTable(
	"verification",
	(d) => ({
		id: d.text().primaryKey(),
		identifier: d.text().notNull(),
		value: d.text().notNull(),
		expiresAt: d.timestamp({ withTimezone: true }).notNull(),
		createdAt: d
			.timestamp({ withTimezone: true })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
	}),
	(t) => [index("verification_identifier_idx").on(t.identifier)],
);

export const posts = createTable(
	"post",
	(d) => ({
		id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
		name: d.varchar({ length: 256 }),
		userId: d.text().references(() => users.id, { onDelete: "cascade" }),
		createdAt: d
			.timestamp({ withTimezone: true })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
	}),
	(t) => [
		index("name_idx").on(t.name),
		index("created_at_idx").on(t.createdAt),
		index("id_created_at_idx").on(t.id, t.createdAt),
		index("post_user_id_idx").on(t.userId),
	],
);
