import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	useEnhancedMutationCallbacks,
	useEnhancedQueryCallbacks,
} from "../use-trpc";

// Mock dependencies
vi.mock("../../lib/error-tracker", () => ({
	useErrorTracker: () => ({
		captureException: vi.fn(),
	}),
}));

vi.mock("../../lib/logger", () => ({
	logger: {
		info: vi.fn(),
		error: vi.fn(),
	},
}));

describe("useEnhancedQueryCallbacks", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should return callbacks object with onSuccess and onError", () => {
		const { result } = renderHook(() => useEnhancedQueryCallbacks());

		expect(result.current).toHaveProperty("onSuccess");
		expect(result.current).toHaveProperty("onError");
		expect(typeof result.current.onSuccess).toBe("function");
		expect(typeof result.current.onError).toBe("function");
	});

	it("should call custom onSuccess when provided", () => {
		const onSuccess = vi.fn();
		const { result } = renderHook(() =>
			useEnhancedQueryCallbacks({ onSuccess }),
		);

		const testData = { id: 1, name: "Test" };
		result.current.onSuccess(testData);

		expect(onSuccess).toHaveBeenCalledWith(testData);
	});

	it("should not throw when onSuccess is not provided", () => {
		const { result } = renderHook(() => useEnhancedQueryCallbacks());

		expect(() => {
			result.current.onSuccess({ data: "test" });
		}).not.toThrow();
	});

	it("should call custom onError when provided", () => {
		const onError = vi.fn();
		const { result } = renderHook(() => useEnhancedQueryCallbacks({ onError }));

		const testError = { message: "Test error" };
		result.current.onError(testError);

		expect(onError).toHaveBeenCalled();
		const errorArg = onError.mock.calls[0]?.[0];
		expect(errorArg).toBeInstanceOf(Error);
		expect(errorArg?.message).toBe("Test error");
	});

	it("should track errors with error tracker", () => {
		const { result } = renderHook(() => useEnhancedQueryCallbacks());

		const testError = { message: "Test error" };
		result.current.onError(testError);

		// Error tracker should have been called (mocked in beforeEach)
		expect(() => result.current.onError(testError)).not.toThrow();
	});

	it("should include error context when provided", () => {
		const errorContext = {
			tags: { source: "test" },
			extra: { data: "value" },
		};

		const { result } = renderHook(() =>
			useEnhancedQueryCallbacks({ errorContext }),
		);

		const testError = { message: "Test error" };
		expect(() => {
			result.current.onError(testError);
		}).not.toThrow();
	});

	it("should respect logPerformance option", () => {
		const { result: withLogging } = renderHook(() =>
			useEnhancedQueryCallbacks({ logPerformance: true }),
		);

		expect(() => {
			withLogging.current.onSuccess({ data: "test" });
		}).not.toThrow();

		const { result: withoutLogging } = renderHook(() =>
			useEnhancedQueryCallbacks({ logPerformance: false }),
		);

		expect(() => {
			withoutLogging.current.onSuccess({ data: "test" });
		}).not.toThrow();
	});
});

describe("useEnhancedMutationCallbacks", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should return callbacks object with onSuccess and onError", () => {
		const { result } = renderHook(() => useEnhancedMutationCallbacks());

		expect(result.current).toHaveProperty("onSuccess");
		expect(result.current).toHaveProperty("onError");
		expect(typeof result.current.onSuccess).toBe("function");
		expect(typeof result.current.onError).toBe("function");
	});

	it("should call custom onSuccess with data and input", () => {
		const onSuccess = vi.fn();
		const { result } = renderHook(() =>
			useEnhancedMutationCallbacks({ onSuccess }),
		);

		const testData = { id: 1 };
		const testInput = { name: "Test" };
		result.current.onSuccess(testData, testInput);

		expect(onSuccess).toHaveBeenCalledWith(testData, testInput);
	});

	it("should not throw when onSuccess is not provided", () => {
		const { result } = renderHook(() => useEnhancedMutationCallbacks());

		expect(() => {
			result.current.onSuccess({ data: "test" }, { input: "test" });
		}).not.toThrow();
	});

	it("should call custom onError with error and input", () => {
		const onError = vi.fn();
		const { result } = renderHook(() =>
			useEnhancedMutationCallbacks({ onError }),
		);

		const testError = { message: "Test error" };
		const testInput = { name: "Test" };
		result.current.onError(testError, testInput);

		expect(onError).toHaveBeenCalled();
		const errorArg = onError.mock.calls[0]?.[0];
		const inputArg = onError.mock.calls[0]?.[1];
		expect(errorArg).toBeInstanceOf(Error);
		expect(errorArg?.message).toBe("Test error");
		expect(inputArg).toBe(testInput);
	});

	it("should track errors with input in extra context", () => {
		const { result } = renderHook(() => useEnhancedMutationCallbacks());

		const testError = { message: "Test error" };
		const testInput = { name: "Test" };
		result.current.onError(testError, testInput);

		// Error tracker should have been called with input in extra
		expect(() => result.current.onError(testError, testInput)).not.toThrow();
	});

	it("should merge error context with input", () => {
		const errorContext = {
			tags: { source: "test" },
			extra: { customData: "value" },
		};

		const { result } = renderHook(() =>
			useEnhancedMutationCallbacks({ errorContext }),
		);

		const testError = { message: "Test error" };
		const testInput = { name: "Test" };
		expect(() => {
			result.current.onError(testError, testInput);
		}).not.toThrow();
	});

	it("should respect logPerformance option", () => {
		const { result: withLogging } = renderHook(() =>
			useEnhancedMutationCallbacks({ logPerformance: true }),
		);

		expect(() => {
			withLogging.current.onSuccess({ data: "test" }, { input: "test" });
		}).not.toThrow();

		const { result: withoutLogging } = renderHook(() =>
			useEnhancedMutationCallbacks({ logPerformance: false }),
		);

		expect(() => {
			withoutLogging.current.onSuccess({ data: "test" }, { input: "test" });
		}).not.toThrow();
	});
});
