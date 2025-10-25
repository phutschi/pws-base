"use client";

import type { ReactNode } from "react";
import React from "react";
import { createContext, useContext } from "react";
import { logger } from "./logger";

/**
 * Interface for pluggable error tracking providers (Sentry, LogRocket, etc.)
 */
export interface ErrorTracker {
	/**
	 * Capture an exception
	 */
	captureException: (error: Error, context?: ErrorContext) => void;

	/**
	 * Capture a message
	 */
	captureMessage: (
		message: string,
		level?: "info" | "warning" | "error",
		context?: ErrorContext,
	) => void;

	/**
	 * Set user context for error tracking
	 */
	setUser: (user: { readonly id: string; readonly email?: string }) => void;

	/**
	 * Add breadcrumb for debugging
	 */
	addBreadcrumb: (breadcrumb: Breadcrumb) => void;
}

export interface ErrorContext {
	readonly tags?: Record<string, string>;
	readonly extra?: Record<string, unknown>;
	readonly level?: "info" | "warning" | "error";
}

export interface Breadcrumb {
	readonly message: string;
	readonly category?: string;
	readonly level?: "debug" | "info" | "warning" | "error";
	readonly data?: Record<string, unknown>;
}

/**
 * Console-based error tracker (default fallback)
 */
class ConsoleErrorTracker implements ErrorTracker {
	captureException(error: Error, context?: ErrorContext): void {
		logger.error("Exception captured", {
			message: error.message,
			stack: error.stack,
			tags: context?.tags,
			extra: context?.extra,
		});
	}

	captureMessage(
		message: string,
		level: "info" | "warning" | "error" = "info",
		context?: ErrorContext,
	): void {
		const logLevel = level === "warning" ? "warn" : level;
		logger[logLevel](message, {
			tags: context?.tags,
			extra: context?.extra,
		});
	}

	setUser(_user: { readonly id: string; readonly email?: string }): void {
		// No-op for console tracker
	}

	addBreadcrumb(breadcrumb: Breadcrumb): void {
		logger.debug("Breadcrumb", {
			message: breadcrumb.message,
			category: breadcrumb.category,
			level: breadcrumb.level,
			data: breadcrumb.data,
		});
	}
}

/**
 * Create the default error tracker instance
 */
const createDefaultErrorTracker = (): ErrorTracker => {
	return new ConsoleErrorTracker();
};

/**
 * Context for global error tracker
 */
const ErrorTrackerContext = createContext<ErrorTracker>(
	createDefaultErrorTracker(),
);

interface ErrorTrackerProviderProps {
	readonly children: ReactNode;
	readonly tracker?: ErrorTracker;
}

/**
 * Provider for error tracker configuration
 */
export const ErrorTrackerProvider = ({
	children,
	tracker,
}: ErrorTrackerProviderProps) => {
	const defaultTracker = createDefaultErrorTracker();
	const value = tracker ?? defaultTracker;

	return (
		<ErrorTrackerContext.Provider value={value}>
			{children}
		</ErrorTrackerContext.Provider>
	);
};

/**
 * Hook to access the global error tracker
 */
export const useErrorTracker = (): ErrorTracker => {
	return useContext(ErrorTrackerContext);
};

/**
 * Export default tracker for use outside React components
 */
export const defaultErrorTracker = createDefaultErrorTracker();
