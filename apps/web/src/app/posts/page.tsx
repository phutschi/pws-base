import { defaultErrorTracker } from "~/shared/lib";
import { logger } from "~/shared/lib/logger";
import { api } from "~/trpc/server";
import { PostsList } from "./components/posts-list";

/**
 * Posts page with server-side prefetching and client-side error handling.
 *
 * Server-side errors are logged and tracked, then the page falls back to
 * client-side data fetching with the usePosts hook in PostsList component.
 */
export default async function PostsPage() {
	try {
		// Attempt to prefetch data on the server for better UX
		await api.posts.getLatest.prefetch();

		logger.info("Posts page rendered successfully");
	} catch (error) {
		// Log server-side prefetch errors
		const err = error as Error;
		logger.error("Failed to prefetch posts", {
			message: err.message,
			stack: err.stack,
		});

		// Track with error tracking service
		defaultErrorTracker.captureException(err, {
			tags: {
				source: "server-prefetch",
				page: "posts",
			},
		});

		// Don't throw - let client-side component handle fetching
		// This provides graceful degradation
	}

	return (
		<div className="container mx-auto max-w-2xl py-8">
			<h1 className="mb-6 text-2xl font-bold">Posts</h1>
			<PostsList />
		</div>
	);
}
