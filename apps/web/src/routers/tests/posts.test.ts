import { TRPCError } from "@trpc/server";
import { describe, expect, it, vi } from "vitest";

// Mock env module to avoid client-side access errors in happy-dom environment
vi.mock("~/env", () => ({
	env: {
		DATABASE_URL: "postgresql://test:test@localhost:5432/test",
		NODE_ENV: "test",
		BETTER_AUTH_SECRET: "test-secret-min-32-chars-long-required",
		BETTER_AUTH_URL: "http://localhost:3000",
		NEXT_PUBLIC_APP_URL: "http://localhost:3000",
	},
}));

import { createCallerFactory } from "~/server/trpc";
import { createMockDb, createMockSession, createMockUser } from "~/test/utils";
import { postsRouter } from "../posts";

describe("postsRouter", () => {
	const createCaller = createCallerFactory(postsRouter);

	describe("hello", () => {
		it("should return greeting with provided text", async () => {
			const caller = createCaller({
				db: createMockDb(),
				session: null,
				user: null,
				headers: new Headers(),
			});

			const result = await caller.hello({ text: "World" });

			expect(result).toEqual({ greeting: "Hello World" });
		});

		it("should handle empty string", async () => {
			const caller = createCaller({
				db: createMockDb(),
				session: null,
				user: null,
				headers: new Headers(),
			});

			const result = await caller.hello({ text: "" });

			expect(result).toEqual({ greeting: "Hello " });
		});
	});

	describe("getLatest", () => {
		it("should return null when no posts exist", async () => {
			const mockUser = createMockUser();
			const mockSession = createMockSession();
			const mockDb = createMockDb();
			vi.mocked(mockDb.query.posts.findFirst).mockResolvedValue(undefined);

			const caller = createCaller({
				db: mockDb,
				session: mockSession,
				user: mockUser,
				headers: new Headers(),
			});

			const result = await caller.getLatest();

			expect(result).toBeNull();
		});

		it("should return the latest post when posts exist", async () => {
			const mockUser = createMockUser();
			const mockSession = createMockSession();
			const mockPost = {
				id: 1,
				name: "Test Post",
				userId: mockUser.id,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			const mockDb = createMockDb();
			vi.mocked(mockDb.query.posts.findFirst).mockResolvedValue(mockPost);

			const caller = createCaller({
				db: mockDb,
				session: mockSession,
				user: mockUser,
				headers: new Headers(),
			});

			const result = await caller.getLatest();

			expect(result).toEqual(mockPost);
		});
	});

	describe("create", () => {
		it("should throw UNAUTHORIZED when not authenticated", async () => {
			const caller = createCaller({
				db: createMockDb(),
				session: null,
				user: null,
				headers: new Headers(),
			});

			await expect(caller.create({ name: "New Post" })).rejects.toThrow(
				TRPCError,
			);

			await expect(caller.create({ name: "New Post" })).rejects.toMatchObject({
				code: "UNAUTHORIZED",
			});
		});

		it("should create post with userId when authenticated", async () => {
			const mockUser = createMockUser();
			const mockSession = createMockSession();
			const mockDb = createMockDb();

			const mockInsert = vi.fn();
			const mockValues = vi.fn();
			mockInsert.mockReturnValue({ values: mockValues });
			mockDb.insert = mockInsert;

			const caller = createCaller({
				db: mockDb,
				session: mockSession,
				user: mockUser,
				headers: new Headers(),
			});

			await caller.create({ name: "New Post" });

			expect(mockInsert).toHaveBeenCalled();
			expect(mockValues).toHaveBeenCalledWith({
				name: "New Post",
				userId: mockUser.id,
			});
		});
	});
});
