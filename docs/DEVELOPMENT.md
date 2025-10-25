# Development Guide

Development workflows, patterns, and best practices for pws-base.

## Development Workflow

### Daily Development

```bash
# 1. Start development server
bun run dev

# 2. Make changes

# 3. Check code quality
bun run check

# 4. Run tests
bun test

# 5. Commit changes (pre-commit hooks run automatically)
git add .
git commit -m "feat: add new feature"
```

### Project Structure

```
apps/web/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Home page
│   │   └── posts/        # Posts feature
│   │       ├── page.tsx  # Posts page
│   │       ├── components/  # Feature components
│   │       └── hooks/    # Feature hooks
│   ├── routers/          # tRPC API routes
│   │   ├── posts.ts      # Posts router
│   │   └── index.ts      # Export all routers
│   ├── server/           # Server utilities
│   │   ├── api.ts        # Root API router
│   │   ├── auth.ts       # Auth config
│   │   ├── db.ts         # Database client
│   │   └── trpc.ts       # tRPC setup
│   ├── shared/           # Shared code
│   │   ├── components/   # Shared components
│   │   ├── hooks/        # Shared hooks
│   │   └── lib/          # Utilities
│   └── env.js            # Env validation
```

## Creating Features

### 1. Create tRPC Router

```typescript
// apps/web/src/routers/users.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/trpc";
import { users } from "@repo/db/schema";
import { eq } from "drizzle-orm";

export const usersRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }): Promise<User | null> => {
      return await ctx.db.query.users.findFirst({
        where: eq(users.id, input.id),
      });
    }),

  updateProfile: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }): Promise<void> => {
      await ctx.db.update(users)
        .set({ name: input.name })
        .where(eq(users.id, ctx.user.id));
    }),
});

// Export from routers/index.ts
export * from "./users";

// Add to server/api.ts
export const appRouter = createTRPCRouter({
  posts: postsRouter,
  users: usersRouter, // Add here
});
```

### 2. Create Database Schema

```typescript
// packages/db/src/schema.ts
export const comments = createTable(
  "comment",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    content: d.text().notNull(),
    postId: d.integer()
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    userId: d.text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: d.timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }),
  (t) => [
    index("comment_post_id_idx").on(t.postId),
    index("comment_user_id_idx").on(t.userId),
  ],
);

// Generate migration
// bun run db:generate

// Apply migration
// bun run db:migrate
```

### 3. Create React Components

```typescript
// app/users/page.tsx (Server Component)
export default async function UsersPage() {
  // Prefetch on server
  await api.users.getById.prefetch({ id: "123" });

  return <UserProfile />;
}

// components/user-profile.tsx (Client Component)
"use client";

import { api } from "~/trpc/react";

export function UserProfile() {
  const { data, isLoading } = api.users.getById.useQuery({ id: "123" });

  if (isLoading) return <div>Loading...</div>;

  return <div>{data?.name}</div>;
}
```

### 4. Create Custom Hooks

```typescript
// shared/hooks/use-user.ts
import { api } from "~/trpc/react";

export function useUser(userId: string) {
  const query = api.users.getById.useQuery({ id: userId });
  const utils = api.useUtils();

  const updateMutation = api.users.updateProfile.useMutation({
    onSuccess: () => {
      void utils.users.getById.invalidate({ id: userId });
    },
  });

  return {
    user: query.data,
    isLoading: query.isLoading,
    update: (name: string) => updateMutation.mutateAsync({ name }),
  };
}
```

## Database Operations

### Migrations

```bash
# Development - push schema directly
bun run db:push

# Production - use migrations
bun run db:generate  # Generate migration
bun run db:migrate   # Apply migrations
```

### Database Studio

```bash
# Open Drizzle Studio
bun run db:studio

# Browse tables, run queries, inspect data
# http://localhost:4983
```

### Query Patterns

```typescript
// Find one
const user = await ctx.db.query.users.findFirst({
  where: eq(users.id, userId),
});

// Find many
const posts = await ctx.db.query.posts.findMany({
  where: eq(posts.userId, userId),
  orderBy: [desc(posts.createdAt)],
  limit: 10,
});

// Insert
await ctx.db.insert(posts).values({
  name: "New Post",
  userId: ctx.user.id,
});

// Update
await ctx.db.update(posts)
  .set({ name: "Updated" })
  .where(eq(posts.id, postId));

// Delete
await ctx.db.delete(posts)
  .where(eq(posts.id, postId));

// Transaction
await ctx.db.transaction(async (tx) => {
  await tx.insert(posts).values({ name: "Post 1" });
  await tx.insert(posts).values({ name: "Post 2" });
});
```

## Testing

### Unit Tests

```typescript
// hooks/use-posts.test.ts
import { describe, it, expect } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { usePosts } from "./use-posts";

describe("usePosts", () => {
  it("should fetch latest post", async () => {
    const { result } = renderHook(() => usePosts());

    await waitFor(() => {
      expect(result.current.post).toBeDefined();
    });
  });
});
```

### Run Tests

```bash
# Run all tests
bun test

# Watch mode
bun test --watch

# UI mode
bun run test:ui

# Coverage
bun test --coverage
```

## Code Quality

### Linting & Formatting

```bash
# Check code quality
bun run check

# Fix issues automatically
bun run check:write

# Type check
bun run check:types
```

### Pre-commit Hooks

Husky + lint-staged runs automatically on commit:

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx,json,jsonc,css,md}": [
      "biome check --write --files-ignore-unknown=true"
    ]
  }
}
```

### Biome Configuration

```jsonc
// biome.jsonc
{
  "formatter": { "enabled": true },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  }
}
```

## Environment Variables

### Adding New Variables

```typescript
// 1. Add to apps/web/src/env.js
server: {
  NEW_API_KEY: z.string().min(1),
},
runtimeEnv: {
  NEW_API_KEY: process.env.NEW_API_KEY,
},

// 2. Add to .env.local
NEW_API_KEY="your-key"

// 3. Add to .env.example
NEW_API_KEY="your-key-here"

// 4. Use in code
import { env } from "~/env";
const apiKey = env.NEW_API_KEY;
```

## Debugging

### Server-Side Debugging

```typescript
import { logger } from "~/shared/lib/logger";

// Structured logging
logger.info("User action", { userId: user.id });
logger.error("Failed to save", { error: err.message });
```

### Client-Side Debugging

```typescript
// React Query Devtools (development only)
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

{process.env.NODE_ENV === "development" && (
  <ReactQueryDevtools initialIsOpen={false} />
)}
```

### tRPC Logging

```typescript
// Enabled automatically in development
// See: apps/web/src/trpc/react.tsx
loggerLink({
  enabled: (op) =>
    process.env.NODE_ENV === "development" ||
    (op.direction === "down" && op.result instanceof Error),
}),
```

## Performance Optimization

### Database

```typescript
// Add indexes for frequently queried fields
index("user_email_idx").on(t.email),
index("post_created_at_idx").on(t.createdAt),

// Use select to limit columns
const posts = await db.select({
  id: posts.id,
  name: posts.name
}).from(posts);
```

### React Query

```typescript
// Set stale time for stable data
api.posts.getLatest.useQuery(undefined, {
  staleTime: 1000 * 60 * 5, // 5 minutes
});

// Prefetch on server
await api.posts.getLatest.prefetch();
```

### Server Components

```typescript
// Use Server Components by default (no "use client")
export default async function Page() {
  // Fetch on server
  const data = await api.posts.getLatest.prefetch();
  return <Component />;
}

// Client Components only when needed
"use client";
export function InteractiveComponent() { }
```

## Git Workflow

### Commit Conventions

```bash
feat: add new feature
fix: resolve bug
refactor: improve code structure
docs: update documentation
perf: improve performance
test: add tests
chore: update dependencies
```

### Branch Strategy

```bash
# Create feature branch
git checkout -b feat/user-profile

# Make changes and commit
git add .
git commit -m "feat: add user profile page"

# Push to remote
git push origin feat/user-profile

# Create pull request
gh pr create --title "Add user profile" --body "..."
```

## Troubleshooting

### Type Errors

```bash
# Rebuild types
bun run check:types

# Clear cache
rm -rf .next
rm -rf node_modules/.cache
```

### tRPC Errors

```typescript
// Check router export in server/api.ts
export const appRouter = createTRPCRouter({
  posts: postsRouter, // ✅ Exported
  users: usersRouter, // ✅ Exported
});

// Restart dev server
bun run dev
```

### Database Sync Issues

```bash
# Reset database (development only!)
bun run db:push

# Or regenerate migrations
bun run db:generate
bun run db:migrate
```

## Best Practices

✅ Use Server Components by default
✅ Add "use client" only when needed
✅ Always validate inputs with Zod
✅ Use protectedProcedure for authenticated routes
✅ Index foreign keys and query fields
✅ Use structured logging (logger, not console)
✅ Write tests for critical paths
✅ Keep components small and focused
✅ Prefer composition over inheritance

## Next Steps

- [API Documentation](./API.md) - Explore available APIs
- [Architecture](./ARCHITECTURE.md) - Understand system design
- [Contributing](./CONTRIBUTING.md) - Contribute to the project
