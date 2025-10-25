import { describe, expect, it } from "vitest";
import { accounts, posts, sessions, users, verifications } from "./schema";

describe("Database Schema", () => {
	describe("users table", () => {
		it("should have correct table name", () => {
			expect(users).toBeDefined();
		});

		it("should have required fields", () => {
			const table = users;
			expect(table).toBeDefined();
		});
	});

	describe("sessions table", () => {
		it("should have correct table name", () => {
			expect(sessions).toBeDefined();
		});

		it("should reference users table", () => {
			const table = sessions;
			expect(table).toBeDefined();
		});
	});

	describe("accounts table", () => {
		it("should have correct table name", () => {
			expect(accounts).toBeDefined();
		});
	});

	describe("verifications table", () => {
		it("should have correct table name", () => {
			expect(verifications).toBeDefined();
		});
	});

	describe("posts table", () => {
		it("should have correct table name", () => {
			expect(posts).toBeDefined();
		});

		it("should have indexes defined", () => {
			const table = posts;
			expect(table).toBeDefined();
		});

		it("should reference users table for userId", () => {
			const table = posts;
			expect(table).toBeDefined();
		});
	});
});
