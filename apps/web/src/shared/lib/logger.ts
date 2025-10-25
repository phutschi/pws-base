/**
 * Pluggable logger for structured logging across the application.
 * Supports different log levels and integration with external services.
 */

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogContext {
	readonly [key: string]: unknown;
}

export interface Logger {
	debug: (message: string, context?: LogContext) => void;
	info: (message: string, context?: LogContext) => void;
	warn: (message: string, context?: LogContext) => void;
	error: (message: string, context?: LogContext) => void;
}

interface LogEntry {
	readonly level: LogLevel;
	readonly message: string;
	readonly timestamp: string;
	readonly context?: LogContext;
}

const formatLogEntry = (entry: LogEntry): string => {
	const { level, message, timestamp, context } = entry;
	const contextStr = context ? ` ${JSON.stringify(context)}` : "";
	return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
};

/**
 * Creates a console-based logger with structured output
 */
const createConsoleLogger = (): Logger => {
	const shouldLog = (level: LogLevel): boolean => {
		// Suppress all logs in test environment
		if (process.env.NODE_ENV === "test") {
			return false;
		}

		// Only log warnings and errors in production
		if (process.env.NODE_ENV === "production") {
			return level === "warn" || level === "error";
		}

		return true;
	};

	const log = (
		level: LogLevel,
		message: string,
		context?: LogContext,
	): void => {
		if (!shouldLog(level)) return;

		const entry: LogEntry = {
			level,
			message,
			timestamp: new Date().toISOString(),
			context,
		};

		const formatted = formatLogEntry(entry);

		switch (level) {
			case "debug":
			case "info":
				console.log(formatted);
				break;
			case "warn":
				console.warn(formatted);
				break;
			case "error":
				console.error(formatted);
				break;
		}
	};

	return {
		debug: (message, context) => log("debug", message, context),
		info: (message, context) => log("info", message, context),
		warn: (message, context) => log("warn", message, context),
		error: (message, context) => log("error", message, context),
	};
};

/**
 * Global logger instance
 */
export const logger = createConsoleLogger();
