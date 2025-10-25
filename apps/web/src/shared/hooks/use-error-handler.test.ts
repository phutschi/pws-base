import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useErrorHandler } from "./use-error-handler";

// Mock the error tracker
vi.mock("../lib/error-tracker", () => ({
	useErrorTracker: () => ({
		captureException: vi.fn(),
	}),
}));

describe("useErrorHandler", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should initialize with no error", () => {
		const { result } = renderHook(() => useErrorHandler());

		expect(result.current.error).toBeNull();
		expect(result.current.hasError).toBe(false);
	});

	it("should handle error and set error state", () => {
		const { result } = renderHook(() => useErrorHandler());
		const testError = new Error("Test error");

		act(() => {
			result.current.handleError(testError);
		});

		expect(result.current.error).toBe(testError);
		expect(result.current.hasError).toBe(true);
	});

	it("should handle error with context", () => {
		const { result } = renderHook(() => useErrorHandler());
		const testError = new Error("Test error");
		const context = { tags: { source: "test" } };

		act(() => {
			result.current.handleError(testError, context);
		});

		expect(result.current.error).toBe(testError);
		expect(result.current.hasError).toBe(true);
	});

	it("should clear error", () => {
		const { result } = renderHook(() => useErrorHandler());
		const testError = new Error("Test error");

		act(() => {
			result.current.handleError(testError);
		});

		expect(result.current.hasError).toBe(true);

		act(() => {
			result.current.clearError();
		});

		expect(result.current.error).toBeNull();
		expect(result.current.hasError).toBe(false);
	});

	it("should handle multiple errors in sequence", () => {
		const { result } = renderHook(() => useErrorHandler());
		const error1 = new Error("Error 1");
		const error2 = new Error("Error 2");

		act(() => {
			result.current.handleError(error1);
		});

		expect(result.current.error).toBe(error1);

		act(() => {
			result.current.handleError(error2);
		});

		expect(result.current.error).toBe(error2);
	});
});
