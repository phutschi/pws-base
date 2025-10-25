# Shared Infrastructure

Production-grade reusable infrastructure for the web application.

## Logger (`lib/logger.ts`)

Structured logging with timestamp and context support.

```ts
import { logger } from "~/shared/lib";

logger.info("User logged in", { userId: "123" });
logger.error("Operation failed", { error: err });
```

## Error Tracker (`lib/error-tracker.tsx`)

Pluggable error tracking system supporting Sentry, LogRocket, or custom providers.

###Usage

**Basic (Console tracking)**:

```tsx
import { ErrorTrackerProvider } from "~/shared/lib";

export default function RootLayout({ children }) {
  return (
    <ErrorTrackerProvider>
      {children}
    </ErrorTrackerProvider>
  );
}
```

**With Sentry**:

```ts
// lib/sentry-tracker.ts
import * as Sentry from "@sentry/nextjs";
import type { ErrorTracker, ErrorContext, Breadcrumb } from "~/shared/lib";

export const createSentryTracker = (): ErrorTracker => ({
  captureException: (error: Error, context?: ErrorContext) => {
    Sentry.captureException(error, {
      tags: context?.tags,
      extra: context?.extra,
      level: context?.level,
    });
  },

  captureMessage: (message: string, level = "info", context?: ErrorContext) => {
    Sentry.captureMessage(message, {
      level: level as Sentry.SeverityLevel,
      tags: context?.tags,
      extra: context?.extra,
    });
  },

  setUser: (user) => {
    Sentry.setUser(user);
  },

  addBreadcrumb: (breadcrumb: Breadcrumb) => {
    Sentry.addBreadcrumb({
      message: breadcrumb.message,
      category: breadcrumb.category,
      level: breadcrumb.level,
      data: breadcrumb.data,
    });
  },
});
```

```tsx
// app/layout.tsx
import { ErrorTrackerProvider } from "~/shared/lib";
import { createSentryTracker } from "~/lib/sentry-tracker";

const sentryTracker = process.env.SENTRY_DSN
  ? createSentryTracker()
  : undefined;

export default function RootLayout({ children }) {
  return (
    <ErrorTrackerProvider tracker={sentryTracker}>
      {children}
    </ErrorTrackerProvider>
  );
}
```

## Hooks

### `useErrorHandler`

Component-level error management with global tracking integration.

```tsx
import { useErrorHandler } from "~/shared/hooks";

export function MyComponent() {
  const { error, handleError, clearError } = useErrorHandler();

  const fetchData = async () => {
    try {
      await apiCall();
    } catch (err) {
      handleError(err as Error, {
        tags: { source: "fetchData" },
      });
    }
  };

  if (error) {
    return (
      <div>
        Error: {error.message}
        <button onClick={clearError}>Dismiss</button>
      </div>
    );
  }

  return <button onClick={fetchData}>Fetch</button>;
}
```

### `useEnhancedQueryCallbacks` & `useEnhancedMutationCallbacks`

Simplified utilities for adding production features to tRPC hooks.

```tsx
import { useEnhancedQueryCallbacks } from "~/shared/hooks";
import { api } from "~/trpc/react";

export function MyComponent() {
  const callbacks = useEnhancedQueryCallbacks({
    onError: (error) => toast.error(error.message),
    logPerformance: true,
  });

  const query = api.myProcedure.useQuery(input, callbacks);

  return <div>{query.data}</div>;
}
```

## Example Hook: `use-posts.ts`

See `app/posts/hooks/use-posts.ts` for a complete example of a production-grade hook using this infrastructure.

## Features

- **Pluggable Error Tracking**: Swap providers without changing application code
- **Structured Logging**: Consistent log format with timestamps and context
- **Type Safety**: Fully typed interfaces with readonly properties
- **Production Ready**: Error tracking, performance monitoring, retry logic
- **Reusable**: All infrastructure is generic and reusable across the app

