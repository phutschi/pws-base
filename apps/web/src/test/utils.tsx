import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import type { AppRouter } from "~/server/api";
import type { Session, User } from "~/server/auth";
import type { db } from "~/server/db";
import { createCallerFactory } from "~/server/trpc";

/**
 * Creates a tRPC caller with mocked context for testing
 */
export const createTestCaller = (opts: {
	db?: typeof db;
	session?: Session | null;
	user?: User | null;
}) => {
	const createCaller = createCallerFactory({} as AppRouter);

	return createCaller({
		db: opts.db ?? ({} as typeof db),
		session: opts.session ?? null,
		user: opts.user ?? null,
		headers: new Headers(),
	});
};

/**
 * Helper to render React components with providers for testing
 */
export const renderWithProviders = (ui: ReactElement) => {
	return render(ui);
};

/**
 * Mock database for testing
 */
export const createMockDb = () => {
	return {
		query: {
			posts: {
				findFirst: vi.fn(),
			},
		},
		insert: vi.fn(() => ({
			values: vi.fn(),
		})),
	} as unknown as typeof db;
};

/**
 * Mock user for testing
 */
export const createMockUser = (overrides?: Partial<User>): User => {
	return {
		id: "test-user-id",
		email: "test@example.com",
		emailVerified: false,
		name: "Test User",
		createdAt: new Date(),
		updatedAt: new Date(),
		...overrides,
	};
};

/**
 * Mock session for testing
 */
export const createMockSession = (overrides?: Partial<Session>): Session => {
	return {
		id: "test-session-id",
		userId: "test-user-id",
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
		ipAddress: null,
		userAgent: null,
		createdAt: new Date(),
		...overrides,
	};
};
