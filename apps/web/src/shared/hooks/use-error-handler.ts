"use client";

import { useCallback, useState } from "react";
import type { ErrorContext } from "../lib/error-tracker";
import { useErrorTracker } from "../lib/error-tracker";

interface UseErrorHandlerReturn {
	readonly error: Error | null;
	readonly hasError: boolean;
	readonly handleError: (error: Error, context?: ErrorContext) => void;
	readonly clearError: () => void;
}

/**
 * Reusable hook for component-level error management.
 * Integrates with the global error tracker for logging and monitoring.
 *
 * @example
 * ```tsx
 * const { error, handleError, clearError } = useErrorHandler();
 *
 * const fetchData = async () => {
 *   try {
 *     await apiCall();
 *   } catch (err) {
 *     handleError(err as Error, { tags: { source: 'fetchData' } });
 *   }
 * };
 * ```
 */
export const useErrorHandler = (): UseErrorHandlerReturn => {
	const [error, setError] = useState<Error | null>(null);
	const errorTracker = useErrorTracker();

	const handleError = useCallback(
		(error: Error, context?: ErrorContext) => {
			setError(error);
			errorTracker.captureException(error, context);
		},
		[errorTracker],
	);

	const clearError = useCallback(() => {
		setError(null);
	}, []);

	return {
		error,
		hasError: error !== null,
		handleError,
		clearError,
	};
};
