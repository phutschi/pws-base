"use client";

/**
 * Example: How to integrate the error tracker in your app layout
 *
 * This file shows how to set up the ErrorTrackerProvider in your
 * root layout with optional Sentry/LogRocket integration.
 */

import type { ReactNode } from "react";
import { ErrorTrackerProvider } from "~/shared/lib";
// import { createSentryTracker } from "~/shared/lib/error-tracker-examples";

interface ExampleLayoutProps {
	readonly children: ReactNode;
}

export const ExampleLayout = ({ children }: ExampleLayoutProps) => {
	// Option 1: Use default console tracker (development)
	return <ErrorTrackerProvider>{children}</ErrorTrackerProvider>;

	// Option 2: Use Sentry in production
	// const tracker =
	//   process.env.NODE_ENV === "production"
	//     ? createSentryTracker()
	//     : undefined;
	//
	// return (
	//   <ErrorTrackerProvider tracker={tracker}>
	//     {children}
	//   </ErrorTrackerProvider>
	// );
};

/**
 * Example: Using the usePosts hook in a component
 */
export const ExamplePostsComponent = () => {
	// const { post, isLoading, createPost, isCreating } = usePosts({
	//   onCreateSuccess: () => toast.success("Post created!"),
	//   onCreateError: (error) => toast.error(error.message),
	//   onQueryError: (error) => toast.error("Failed to load posts"),
	// });
	//
	// if (isLoading) return <div>Loading...</div>;
	//
	// return (
	//   <div>
	//     {post && <div>{post.name}</div>}
	//     <button
	//       onClick={() => createPost("New Post")}
	//       disabled={isCreating}
	//     >
	//       {isCreating ? "Creating..." : "Create Post"}
	//     </button>
	//   </div>
	// );

	return <div>See commented code for usage example</div>;
};
