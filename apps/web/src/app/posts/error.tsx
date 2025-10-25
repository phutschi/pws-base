"use client";

import { Button } from "@repo/ui/components/button";
import { useEffect } from "react";
import { useErrorTracker } from "~/shared/lib/error-tracker";
import { logger } from "~/shared/lib/logger";

interface ErrorProps {
	readonly error: Error & { digest?: string };
	readonly reset: () => void;
}

/**
 * Error boundary for the posts page.
 * Catches rendering errors and provides recovery UI.
 */
export default function PostsError({ error, reset }: ErrorProps) {
	const errorTracker = useErrorTracker();

	useEffect(() => {
		// Log error when component mounts
		logger.error("Posts page error", {
			message: error.message,
			digest: error.digest,
			stack: error.stack,
		});

		// Track error with error tracking service
		errorTracker.captureException(error, {
			tags: {
				page: "posts",
				digest: error.digest || "unknown",
			},
			extra: {
				stack: error.stack,
			},
		});
	}, [error, errorTracker]);

	return (
		<div className="flex min-h-[400px] flex-col items-center justify-center p-8">
			<div className="w-full max-w-md space-y-4 rounded-lg border border-destructive/50 bg-destructive/10 p-6">
				<div>
					<h2 className="text-lg font-semibold text-destructive">
						Something went wrong
					</h2>
					<p className="mt-2 text-sm text-destructive/80">
						An error occurred while loading the posts page.
					</p>
					{error.message && (
						<p className="mt-2 text-xs font-mono text-destructive/70">
							{error.message}
						</p>
					)}
				</div>

				<Button onClick={() => reset()} variant="destructive" size="lg">
					Try again
				</Button>
			</div>
		</div>
	);
}
