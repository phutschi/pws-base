/**
 * Loading state for the posts page.
 * Displayed while the page is being rendered on the server.
 */
export default function PostsLoading() {
	return (
		<div className="container mx-auto max-w-2xl py-8">
			<div className="mb-6 h-8 w-32 animate-pulse rounded-md bg-muted" />
			<div className="space-y-4">
				<div className="h-32 animate-pulse rounded-lg border bg-muted" />
				<div className="h-48 animate-pulse rounded-lg border bg-muted" />
			</div>
		</div>
	);
}
