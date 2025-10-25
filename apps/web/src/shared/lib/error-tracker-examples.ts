/**
 * Example: Creating a Sentry-based error tracker
 *
 * 1. Install Sentry: pnpm add @sentry/nextjs
 * 2. Initialize Sentry in your app
 * 3. Create this tracker
 * 4. Pass it to ErrorTrackerProvider in layout.tsx
 */

import type { Breadcrumb, ErrorContext, ErrorTracker } from "~/shared/lib";

/**
 * Example Sentry tracker implementation.
 * Uncomment and adapt when @sentry/nextjs is installed.
 */
export const createSentryTracker = (): ErrorTracker => {
	// const Sentry = require("@sentry/nextjs");

	return {
		captureException: (error: Error, context?: ErrorContext) => {
			// Sentry.captureException(error, {
			//   tags: context?.tags,
			//   extra: context?.extra,
			//   level: context?.level,
			// });
			console.error("Sentry would capture:", error, context);
		},

		captureMessage: (
			message: string,
			level: "info" | "warning" | "error" = "info",
			context?: ErrorContext,
		) => {
			// Sentry.captureMessage(message, {
			//   level: level as Sentry.SeverityLevel,
			//   tags: context?.tags,
			//   extra: context?.extra,
			// });
			console.log("Sentry would capture message:", message, level, context);
		},

		setUser: (user: { readonly id: string; readonly email?: string }) => {
			// Sentry.setUser(user);
			console.log("Sentry would set user:", user);
		},

		addBreadcrumb: (breadcrumb: Breadcrumb) => {
			// Sentry.addBreadcrumb({
			//   message: breadcrumb.message,
			//   category: breadcrumb.category,
			//   level: breadcrumb.level,
			//   data: breadcrumb.data,
			// });
			console.log("Sentry would add breadcrumb:", breadcrumb);
		},
	};
};

/**
 * Example LogRocket tracker implementation.
 * Uncomment and adapt when logrocket is installed.
 */
export const createLogRocketTracker = (): ErrorTracker => {
	// const LogRocket = require("logrocket");

	return {
		captureException: (error: Error, context?: ErrorContext) => {
			// LogRocket.captureException(error, {
			//   tags: context?.tags,
			//   extra: context?.extra,
			// });
			console.error("LogRocket would capture:", error, context);
		},

		captureMessage: (
			message: string,
			level: "info" | "warning" | "error" = "info",
			context?: ErrorContext,
		) => {
			// LogRocket.log(message, level, context);
			console.log("LogRocket would capture message:", message, level, context);
		},

		setUser: (user: { readonly id: string; readonly email?: string }) => {
			// LogRocket.identify(user.id, {
			//   email: user.email,
			// });
			console.log("LogRocket would identify user:", user);
		},

		addBreadcrumb: (breadcrumb: Breadcrumb) => {
			// LogRocket.track(breadcrumb.message, breadcrumb.data);
			console.log("LogRocket would add breadcrumb:", breadcrumb);
		},
	};
};
