"use client";

import { useCallback } from "react";
import type { ErrorContext } from "../lib/error-tracker";
import { useErrorTracker } from "../lib/error-tracker";
import { logger } from "../lib/logger";

/**
 * Options for enhancing tRPC queries with production features
 */
export interface EnhancedQueryOptions<TData> {
	readonly onSuccess?: (data: TData) => void;
	readonly onError?: (error: Error) => void;
	readonly logPerformance?: boolean;
	readonly errorContext?: ErrorContext;
}

/**
 * Creates enhanced callbacks for tRPC queries with error tracking and logging.
 *
 * @example
 * ```tsx
 * const errorTracker = useErrorTracker();
 * const callbacks = useEnhancedQueryCallbacks({
 *   onError: (error) => toast.error(error.message),
 *   logPerformance: true,
 * }, errorTracker);
 *
 * const query = api.myProcedure.useQuery(input, callbacks);
 * ```
 */
export const useEnhancedQueryCallbacks = <TData>(
	options: EnhancedQueryOptions<TData> = {},
) => {
	const {
		onSuccess,
		onError,
		logPerformance = process.env.NODE_ENV === "development",
		errorContext,
	} = options;

	const errorTracker = useErrorTracker();

	return {
		onSuccess: useCallback(
			(data: TData) => {
				if (logPerformance) {
					logger.info("Query succeeded", { hasData: !!data });
				}
				if (onSuccess) {
					onSuccess(data);
				}
			},
			[onSuccess, logPerformance],
		),
		onError: useCallback(
			(error: { message: string }) => {
				const standardError = new Error(error.message);

				logger.error("Query failed", {
					message: error.message,
				});

				errorTracker.captureException(standardError, {
					tags: { source: "trpc-query", ...errorContext?.tags },
					extra: errorContext?.extra,
				});

				if (onError) {
					onError(standardError);
				}
			},
			[onError, errorTracker, errorContext],
		),
	};
};

/**
 * Options for enhancing tRPC mutations with production features
 */
export interface EnhancedMutationOptions<TData, TInput> {
	readonly onSuccess?: (data: TData, input: TInput) => void;
	readonly onError?: (error: Error, input: TInput) => void;
	readonly logPerformance?: boolean;
	readonly errorContext?: ErrorContext;
}

/**
 * Creates enhanced callbacks for tRPC mutations with error tracking and logging.
 *
 * @example
 * ```tsx
 * const callbacks = useEnhancedMutationCallbacks({
 *   onSuccess: () => toast.success("Created"),
 *   onError: (error) => toast.error(error.message),
 * });
 *
 * const mutation = api.myProcedure.useMutation(callbacks);
 * ```
 */
export const useEnhancedMutationCallbacks = <TData, TInput>(
	options: EnhancedMutationOptions<TData, TInput> = {},
) => {
	const {
		onSuccess,
		onError,
		logPerformance = process.env.NODE_ENV === "development",
		errorContext,
	} = options;

	const errorTracker = useErrorTracker();

	return {
		onSuccess: useCallback(
			(data: TData, input: TInput) => {
				if (logPerformance) {
					logger.info("Mutation succeeded", { hasData: !!data });
				}
				if (onSuccess) {
					onSuccess(data, input);
				}
			},
			[onSuccess, logPerformance],
		),
		onError: useCallback(
			(error: { message: string }, input: TInput) => {
				const standardError = new Error(error.message);

				logger.error("Mutation failed", {
					message: error.message,
				});

				errorTracker.captureException(standardError, {
					tags: { source: "trpc-mutation", ...errorContext?.tags },
					extra: { input, ...errorContext?.extra },
				});

				if (onError) {
					onError(standardError, input);
				}
			},
			[onError, errorTracker, errorContext],
		),
	};
};
