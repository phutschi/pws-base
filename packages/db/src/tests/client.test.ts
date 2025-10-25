import { describe, expect, it, vi } from "vitest";

// Mock bun env before importing client
vi.mock("bun", () => ({
	env: {
		DATABASE_URL: "postgresql://test:test@localhost:5432/test",
	},
}));

// Dynamic import after mock
const clientModule = await import("../client");
const { client, db } = clientModule;

describe("Database Client", () => {
	describe("postgres client", () => {
		it("should export a postgres client instance", () => {
			expect(client).toBeDefined();
			expect(typeof client).toBe("function");
		});

		it("should have end method", () => {
			expect(client.end).toBeDefined();
			expect(typeof client.end).toBe("function");
		});
	});

	describe("drizzle db instance", () => {
		it("should export a drizzle db instance", () => {
			expect(db).toBeDefined();
		});

		it("should have query method", () => {
			expect(db.query).toBeDefined();
		});

		it("should have insert method", () => {
			expect(db.insert).toBeDefined();
			expect(typeof db.insert).toBe("function");
		});

		it("should have update method", () => {
			expect(db.update).toBeDefined();
			expect(typeof db.update).toBe("function");
		});

		it("should have delete method", () => {
			expect(db.delete).toBeDefined();
			expect(typeof db.delete).toBe("function");
		});

		it("should have select method", () => {
			expect(db.select).toBeDefined();
			expect(typeof db.select).toBe("function");
		});
	});

	describe("schema integration", () => {
		it("should have access to users table via query", () => {
			expect(db.query.users).toBeDefined();
		});

		it("should have access to posts table via query", () => {
			expect(db.query.posts).toBeDefined();
		});

		it("should have access to sessions table via query", () => {
			expect(db.query.sessions).toBeDefined();
		});

		it("should have access to accounts table via query", () => {
			expect(db.query.accounts).toBeDefined();
		});

		it("should have access to verifications table via query", () => {
			expect(db.query.verifications).toBeDefined();
		});
	});
});
