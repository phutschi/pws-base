import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "~/server/auth";

/**
 * Protected layout for posts section.
 *
 * Ensures all routes under /posts/* require authentication.
 * Redirects unauthenticated users to the sign-in page.
 */
export default async function PostsLayout({
	children,
}: {
	readonly children: React.ReactNode;
}) {
	// Check authentication
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	// Redirect to sign-in if not authenticated
	if (!session) {
		redirect("/auth/signin");
	}

	// User is authenticated, render children
	return <>{children}</>;
}
