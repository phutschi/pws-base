import { render, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
	ErrorTrackerProvider,
	defaultErrorTracker,
	useErrorTracker,
} from "../error-tracker";
import type { ErrorTracker } from "../error-tracker";

// Mock the logger
vi.mock("../logger", () => ({
	logger: {
		error: vi.fn(),
		info: vi.fn(),
		warn: vi.fn(),
		debug: vi.fn(),
	},
}));

describe("ConsoleErrorTracker", () => {
	describe("captureException", () => {
		it("should capture exception without context", () => {
			const error = new Error("Test error");
			expect(() => {
				defaultErrorTracker.captureException(error);
			}).not.toThrow();
		});

		it("should capture exception with context", () => {
			const error = new Error("Test error");
			const context = {
				tags: { source: "test" },
				extra: { data: "value" },
			};

			expect(() => {
				defaultErrorTracker.captureException(error, context);
			}).not.toThrow();
		});
	});

	describe("captureMessage", () => {
		it("should capture info message", () => {
			expect(() => {
				defaultErrorTracker.captureMessage("Info message", "info");
			}).not.toThrow();
		});

		it("should capture warning message", () => {
			expect(() => {
				defaultErrorTracker.captureMessage("Warning message", "warning");
			}).not.toThrow();
		});

		it("should capture error message", () => {
			expect(() => {
				defaultErrorTracker.captureMessage("Error message", "error");
			}).not.toThrow();
		});

		it("should default to info level when not specified", () => {
			expect(() => {
				defaultErrorTracker.captureMessage("Default message");
			}).not.toThrow();
		});

		it("should handle context", () => {
			const context = {
				tags: { source: "test" },
				extra: { data: "value" },
			};

			expect(() => {
				defaultErrorTracker.captureMessage(
					"Message with context",
					"info",
					context,
				);
			}).not.toThrow();
		});
	});

	describe("setUser", () => {
		it("should set user without throwing", () => {
			expect(() => {
				defaultErrorTracker.setUser({ id: "123", email: "test@example.com" });
			}).not.toThrow();
		});

		it("should work without email", () => {
			expect(() => {
				defaultErrorTracker.setUser({ id: "123" });
			}).not.toThrow();
		});
	});

	describe("addBreadcrumb", () => {
		it("should add breadcrumb with minimal data", () => {
			expect(() => {
				defaultErrorTracker.addBreadcrumb({
					message: "Test breadcrumb",
				});
			}).not.toThrow();
		});

		it("should add breadcrumb with full data", () => {
			expect(() => {
				defaultErrorTracker.addBreadcrumb({
					message: "Test breadcrumb",
					category: "navigation",
					level: "info",
					data: { path: "/test" },
				});
			}).not.toThrow();
		});
	});
});

describe("ErrorTrackerProvider", () => {
	it("should provide default error tracker", () => {
		const { result } = renderHook(() => useErrorTracker(), {
			wrapper: ({ children }) => (
				<ErrorTrackerProvider>{children}</ErrorTrackerProvider>
			),
		});

		expect(result.current).toBeDefined();
		expect(result.current.captureException).toBeDefined();
		expect(result.current.captureMessage).toBeDefined();
		expect(result.current.setUser).toBeDefined();
		expect(result.current.addBreadcrumb).toBeDefined();
	});

	it("should provide custom error tracker", () => {
		const customTracker: ErrorTracker = {
			captureException: vi.fn(),
			captureMessage: vi.fn(),
			setUser: vi.fn(),
			addBreadcrumb: vi.fn(),
		};

		const { result } = renderHook(() => useErrorTracker(), {
			wrapper: ({ children }) => (
				<ErrorTrackerProvider tracker={customTracker}>
					{children}
				</ErrorTrackerProvider>
			),
		});

		expect(result.current).toBe(customTracker);
	});

	it("should render children correctly", () => {
		const { getByText } = render(
			<ErrorTrackerProvider>
				<div>Test Child</div>
			</ErrorTrackerProvider>,
		);

		expect(getByText("Test Child")).toBeDefined();
	});
});

describe("useErrorTracker", () => {
	it("should return error tracker with all methods", () => {
		const { result } = renderHook(() => useErrorTracker(), {
			wrapper: ({ children }) => (
				<ErrorTrackerProvider>{children}</ErrorTrackerProvider>
			),
		});

		expect(typeof result.current.captureException).toBe("function");
		expect(typeof result.current.captureMessage).toBe("function");
		expect(typeof result.current.setUser).toBe("function");
		expect(typeof result.current.addBreadcrumb).toBe("function");
	});

	it("should use custom tracker when provided", () => {
		const customTracker: ErrorTracker = {
			captureException: vi.fn(),
			captureMessage: vi.fn(),
			setUser: vi.fn(),
			addBreadcrumb: vi.fn(),
		};

		const { result } = renderHook(() => useErrorTracker(), {
			wrapper: ({ children }) => (
				<ErrorTrackerProvider tracker={customTracker}>
					{children}
				</ErrorTrackerProvider>
			),
		});

		const error = new Error("Test");
		result.current.captureException(error);

		expect(customTracker.captureException).toHaveBeenCalledWith(error);
	});
});
