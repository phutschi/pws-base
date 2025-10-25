import { TRPCError } from "@trpc/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createCallerFactory } from "~/server/trpc";
import { createMockDb, createMockSession, createMockUser } from "~/test/utils";
import { postsRouter } from "./posts";

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
			const mockDb = createMockDb();
			mockDb.query.posts.findFirst.mockResolvedValue(undefined);

			const caller = createCaller({
				db: mockDb,
				session: null,
				user: null,
				headers: new Headers(),
			});

			const result = await caller.getLatest();

			expect(result).toBeNull();
		});

		it("should return the latest post when posts exist", async () => {
			const mockPost = {
				id: 1,
				name: "Test Post",
				userId: "user-1",
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			const mockDb = createMockDb();
			mockDb.query.posts.findFirst.mockResolvedValue(mockPost);

			const caller = createCaller({
				db: mockDb,
				session: null,
				user: null,
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
