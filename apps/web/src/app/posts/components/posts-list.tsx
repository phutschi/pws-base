"use client";

import { logger } from "~/shared/lib/logger";
import { usePosts } from "../hooks/use-posts";

export const PostsList = () => {
	const { post, isLoading, error, createPost, isCreating } = usePosts({
		onCreateSuccess: () => {
			logger.info("Post created successfully!");
		},
		onCreateError: (error) => {
			logger.error("Failed to create post", { message: error.message });
		},
		onQueryError: (error) => {
			logger.error("Failed to load posts", { message: error.message });
		},
	});

	if (isLoading) {
		return (
			<div className="flex items-center justify-center p-8">
				<div className="text-muted-foreground">Loading posts...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
				<h3 className="font-semibold text-destructive">Failed to load posts</h3>
				<p className="mt-1 text-sm text-destructive/80">{error.message}</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="rounded-lg border p-4">
				<h2 className="text-lg font-semibold">Latest Post</h2>
				{post ? (
					<div className="mt-2">
						<p className="text-sm text-muted-foreground">
							Name: {post.name || "Untitled"}
						</p>
						<p className="text-xs text-muted-foreground">
							Created: {new Date(post.createdAt).toLocaleDateString()}
						</p>
					</div>
				) : (
					<p className="mt-2 text-sm text-muted-foreground">No posts yet</p>
				)}
			</div>

			<div className="rounded-lg border p-4">
				<h3 className="text-sm font-semibold">Create New Post</h3>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						const formData = new FormData(e.currentTarget);
						const name = formData.get("name") as string;
						if (name) {
							void createPost(name);
							e.currentTarget.reset();
						}
					}}
					className="mt-2 space-y-2"
				>
					<input
						type="text"
						name="name"
						placeholder="Post name"
						required
						className="w-full rounded-md border px-3 py-2 text-sm"
						disabled={isCreating}
					/>
					<button
						type="submit"
						disabled={isCreating}
						className="w-full rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground disabled:opacity-50"
					>
						{isCreating ? "Creating..." : "Create Post"}
					</button>
				</form>
			</div>
		</div>
	);
};
