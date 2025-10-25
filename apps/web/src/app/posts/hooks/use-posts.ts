"use client";

import { useCallback, useEffect } from "react";
import { useErrorTracker } from "~/shared/lib/error-tracker";
import { logger } from "~/shared/lib/logger";
import type { RouterOutputs } from "~/trpc/react";
import { api } from "~/trpc/react";

type Post = RouterOutputs["posts"]["getLatest"];

export interface UsePostsOptions {
	readonly onCreateSuccess?: () => void;
	readonly onCreateError?: (error: Error) => void;
	readonly onQueryError?: (error: Error) => void;
}

export interface UsePostsReturn {
	readonly post: Post | undefined;
	readonly isLoading: boolean;
	readonly isError: boolean;
	readonly error: Error | null;
	readonly isFetching: boolean;
	readonly isStale: boolean;
	readonly refetch: () => Promise<void>;
	readonly createPost: (name: string) => Promise<void>;
	readonly isCreating: boolean;
	readonly createError: Error | null;
}

/**
 * Production-grade hook for managing posts.
 * Provides type-safe access to post queries and mutations with
 * built-in error handling, logging, and performance tracking.
 *
 * @example
 * ```tsx
 * const {
 *   post,
 *   isLoading,
 *   createPost,
 *   isCreating,
 * } = usePosts({
 *   onCreateSuccess: () => toast.success("Post created"),
 *   onCreateError: (error) => toast.error(error.message),
 * });
 * ```
 */
export const usePosts = (options: UsePostsOptions = {}): UsePostsReturn => {
	const { onCreateSuccess, onCreateError, onQueryError } = options;
	const errorTracker = useErrorTracker();

	const query = api.posts.getLatest.useQuery(undefined, {
		refetchOnWindowFocus: false,
		refetchOnReconnect: true,
		retry: 3,
		staleTime: 30000,
	});

	// React Query v5 pattern: use useEffect for side effects
	useEffect(() => {
		if (query.data !== undefined) {
			logger.info("Posts query succeeded", { hasData: !!query.data });
		}
	}, [query.data]);

	useEffect(() => {
		if (query.error) {
			const standardError = new Error(query.error.message);

			logger.error("Posts query failed", {
				message: query.error.message,
			});

			errorTracker.captureException(standardError, {
				tags: { source: "posts-query" },
			});

			if (onQueryError) {
				onQueryError(standardError);
			}
		}
	}, [query.error, errorTracker, onQueryError]);

	const utils = api.useUtils();

	const createMutation = api.posts.create.useMutation({
		onMutate: async (variables) => {
			// Cancel any outgoing refetches to prevent race conditions
			await utils.posts.getLatest.cancel();

			// Snapshot the previous value
			const previousPost = utils.posts.getLatest.getData();

			// Optimistically update to the new value
			const optimisticPost: Post = {
				id: -Date.now(),
				name: variables.name,
				createdAt: new Date(),
				updatedAt: null,
			};

			utils.posts.getLatest.setData(undefined, optimisticPost);

			logger.info("Optimistic post update applied", {
				name: variables.name,
			});

			// Return context with the previous value
			return { previousPost };
		},
		onSuccess: () => {
			logger.info("Post created successfully");
			void utils.posts.getLatest.invalidate();
			if (onCreateSuccess) {
				onCreateSuccess();
			}
		},
		onError: (error, variables, context) => {
			// Roll back to the previous value on error
			if (context?.previousPost !== undefined) {
				utils.posts.getLatest.setData(undefined, context.previousPost);
				logger.info("Optimistic update rolled back", {
					name: variables.name,
				});
			}

			// Handle error logging and callbacks
			const standardError = new Error(error.message);

			logger.error("Create post failed", {
				message: error.message,
			});

			errorTracker.captureException(standardError, {
				tags: { source: "posts-create" },
			});

			if (onCreateError) {
				onCreateError(standardError);
			}
		},
	});

	const refetch = useCallback(async () => {
		try {
			await query.refetch();
		} catch (error) {
			logger.error("Manual refetch failed", { error });
			throw error;
		}
	}, [query]);

	const createPost = useCallback(
		async (name: string) => {
			await createMutation.mutateAsync({ name });
		},
		[createMutation],
	);

	return {
		post: query.data,
		isLoading: query.isLoading,
		isError: query.isError,
		error: query.error ? new Error(query.error.message) : null,
		isFetching: query.isFetching,
		isStale: query.isStale,
		refetch,
		createPost,
		isCreating: createMutation.isPending,
		createError: createMutation.error
			? new Error(createMutation.error.message)
			: null,
	};
};
