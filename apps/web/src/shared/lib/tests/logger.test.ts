import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { logger } from "../logger";

// Mock console methods and suppress actual output
const consoleMocks = {
	log: vi.spyOn(console, "log").mockImplementation(() => {}),
	warn: vi.spyOn(console, "warn").mockImplementation(() => {}),
	error: vi.spyOn(console, "error").mockImplementation(() => {}),
};

describe("logger", () => {
	const originalEnv = process.env.NODE_ENV;

	beforeEach(() => {
		// Clear all mocks before each test
		for (const mock of Object.values(consoleMocks)) {
			mock.mockClear();
		}
	});

	afterEach(() => {
		vi.stubEnv("NODE_ENV", originalEnv);
	});

	describe("log levels", () => {
		it("should log debug messages in development", () => {
			vi.stubEnv("NODE_ENV", "development");
			logger.debug("Debug message");
			expect(consoleMocks.log).toHaveBeenCalledWith(
				expect.stringContaining("[DEBUG] Debug message"),
			);
		});

		it("should log info messages in development", () => {
			vi.stubEnv("NODE_ENV", "development");
			logger.info("Info message");
			expect(consoleMocks.log).toHaveBeenCalledWith(
				expect.stringContaining("[INFO] Info message"),
			);
		});

		it("should log warn messages", () => {
			vi.stubEnv("NODE_ENV", "development");
			logger.warn("Warning message");
			expect(consoleMocks.warn).toHaveBeenCalledWith(
				expect.stringContaining("[WARN] Warning message"),
			);
		});

		it("should log error messages", () => {
			vi.stubEnv("NODE_ENV", "development");
			logger.error("Error message");
			expect(consoleMocks.error).toHaveBeenCalledWith(
				expect.stringContaining("[ERROR] Error message"),
			);
		});
	});

	describe("context formatting", () => {
		it("should include context in log output", () => {
			vi.stubEnv("NODE_ENV", "development");
			logger.info("Message with context", { userId: "123", action: "test" });

			expect(consoleMocks.log).toHaveBeenCalledWith(
				expect.stringContaining('"userId":"123"'),
			);
			expect(consoleMocks.log).toHaveBeenCalledWith(
				expect.stringContaining('"action":"test"'),
			);
		});

		it("should work without context", () => {
			vi.stubEnv("NODE_ENV", "development");
			logger.info("Message without context");

			expect(consoleMocks.log).toHaveBeenCalledWith(
				expect.stringContaining("[INFO] Message without context"),
			);
		});
	});

	describe("environment-based filtering", () => {
		it("should suppress all logs in test environment", () => {
			vi.stubEnv("NODE_ENV", "test");
			logger.debug("Debug");
			logger.info("Info");
			logger.warn("Warn");
			logger.error("Error");

			expect(consoleMocks.log).not.toHaveBeenCalled();
			expect(consoleMocks.warn).not.toHaveBeenCalled();
			expect(consoleMocks.error).not.toHaveBeenCalled();
		});

		it("should only log warnings and errors in production", () => {
			vi.stubEnv("NODE_ENV", "production");

			logger.debug("Debug");
			logger.info("Info");
			expect(consoleMocks.log).not.toHaveBeenCalled();

			logger.warn("Warning");
			expect(consoleMocks.warn).toHaveBeenCalledWith(
				expect.stringContaining("[WARN] Warning"),
			);

			logger.error("Error");
			expect(consoleMocks.error).toHaveBeenCalledWith(
				expect.stringContaining("[ERROR] Error"),
			);
		});

		it("should log all levels in development", () => {
			vi.stubEnv("NODE_ENV", "development");

			logger.debug("Debug");
			expect(consoleMocks.log).toHaveBeenCalledWith(
				expect.stringContaining("[DEBUG] Debug"),
			);

			logger.info("Info");
			expect(consoleMocks.log).toHaveBeenCalledWith(
				expect.stringContaining("[INFO] Info"),
			);

			logger.warn("Warning");
			expect(consoleMocks.warn).toHaveBeenCalledWith(
				expect.stringContaining("[WARN] Warning"),
			);

			logger.error("Error");
			expect(consoleMocks.error).toHaveBeenCalledWith(
				expect.stringContaining("[ERROR] Error"),
			);
		});
	});

	describe("structured output", () => {
		it("should include timestamp in log output", () => {
			vi.stubEnv("NODE_ENV", "development");
			logger.info("Test message");

			const logCall = consoleMocks.log.mock.calls[0]?.[0];
			// Check for ISO 8601 timestamp format
			expect(logCall).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
		});

		it("should format log entry with all components", () => {
			vi.stubEnv("NODE_ENV", "development");
			logger.info("Test message", { key: "value" });

			const logCall = consoleMocks.log.mock.calls[0]?.[0];
			expect(logCall).toContain("[INFO]");
			expect(logCall).toContain("Test message");
			expect(logCall).toContain('"key":"value"');
		});
	});
});
