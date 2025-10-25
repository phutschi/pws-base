# pws-base

Modern full-stack TypeScript monorepo with Next.js 16, tRPC, and Drizzle ORM.

## Features

✅ **End-to-end type safety** - Database → API → UI
✅ **Modern React 19** - Server Components + App Router
✅ **tRPC 11** - Type-safe APIs with TanStack Query
✅ **Drizzle ORM** - Type-safe PostgreSQL with migrations
✅ **Better Auth** - Secure authentication & sessions
✅ **Radix UI + Tailwind v4** - Accessible components with modern styling
✅ **Turborepo** - Fast, optimized monorepo builds
✅ **Bun** - Lightning-fast package manager

## Quick Start

```bash
# Install dependencies
bun install

# Setup environment
cp apps/web/.env.example apps/web/.env.local
# Edit .env.local with your database credentials

# Run database migrations
bun run db:push

# Start development server
bun run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
pws-base/
├── apps/
│   └── web/              # Next.js 16 application
│       ├── src/app/      # App Router pages
│       ├── src/routers/  # tRPC API routes
│       ├── src/server/   # Server utilities
│       └── src/shared/   # Shared code
├── packages/
│   ├── @repo/db          # Database layer (Drizzle)
│   ├── @repo/ui          # UI components (Radix)
│   ├── @repo/tailwind-config
│   └── @repo/typescript-config
└── .cursor/
    └── rules/            # AI coding rules
```

## Tech Stack

### Frontend
- **Framework**: Next.js 16 with App Router
- **React**: 19.2 with Server Components
- **State**: TanStack Query 5.69
- **Styling**: Tailwind CSS v4
- **Components**: Radix UI primitives
- **Icons**: Lucide React

### Backend
- **API**: tRPC 11 with type-safe procedures
- **Database**: PostgreSQL with Drizzle ORM
- **Auth**: Better Auth with session management
- **Validation**: Zod schemas

### Development
- **Build**: Turborepo with caching
- **Package Manager**: Bun 1.2
- **Linting**: Biome 1.9.4
- **TypeScript**: 5.x (strict mode)
- **Testing**: Vitest 4.x

## Available Commands

### Development
```bash
bun run dev          # Start dev server (all packages)
bun run build        # Production build
bun run preview      # Preview production build
```

### Database
```bash
bun run db:generate  # Generate migration files
bun run db:migrate   # Run migrations
bun run db:push      # Push schema changes (dev only)
bun run db:studio    # Open Drizzle Studio
```

### Code Quality
```bash
bun run check        # Lint and format check
bun run check:write  # Fix linting and formatting
bun run check:types  # TypeScript type checking
bun run lint         # Run linter only
bun test             # Run tests
```

## Documentation

- [Setup Guide](./docs/SETUP.md) - Detailed installation and configuration
- [Development Guide](./docs/DEVELOPMENT.md) - Development workflows and patterns
- [API Documentation](./docs/API.md) - tRPC API reference
- [Architecture](./docs/ARCHITECTURE.md) - System architecture and design decisions
- [Contributing](./docs/CONTRIBUTING.md) - Contribution guidelines

## Environment Variables

Required environment variables:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/pws-base"

# Authentication
BETTER_AUTH_SECRET="min-32-character-secret-key"
BETTER_AUTH_URL="http://localhost:3000"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

See `apps/web/.env.example` for complete list.

## Key Features

### Type-Safe APIs with tRPC

```typescript
// Define API routes
export const postsRouter = createTRPCRouter({
  getLatest: protectedProcedure
    .query(async ({ ctx }): Promise<Post | null> => {
      return await ctx.db.query.posts.findFirst({
        where: eq(posts.userId, ctx.user.id),
        orderBy: [desc(posts.createdAt)],
      });
    }),
});

// Use in React components
const { data } = api.posts.getLatest.useQuery();
```

### Database Schema with Drizzle

```typescript
export const posts = createTable(
  "post",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 256 }),
    userId: d.text().references(() => users.id, { onDelete: "cascade" }),
    createdAt: d.timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }),
  (t) => [
    index("post_user_id_idx").on(t.userId),
  ],
);
```

### Server Components by Default

```typescript
// Server Component - fetches on server
export default async function PostsPage() {
  await api.posts.getLatest.prefetch();
  return <PostsList />;
}

// Client Component - interactive
"use client";
export function PostsList() {
  const { data } = api.posts.getLatest.useQuery();
  return <div>{data?.name}</div>;
}
```

## Performance

- ⚡ **Server Components** - Zero JavaScript by default
- ⚡ **tRPC Batching** - Multiple requests in single HTTP call
- ⚡ **Database Indexes** - Optimized query performance
- ⚡ **TanStack Query** - Smart caching and prefetching
- ⚡ **Turborepo** - Incremental builds with caching

## Security

- 🔒 **Better Auth** - Secure session management
- 🔒 **Protected Procedures** - Authentication middleware
- 🔒 **Input Validation** - Zod schemas for all inputs
- 🔒 **SQL Injection Prevention** - Type-safe query builder
- 🔒 **Environment Validation** - Runtime env var checking

## Code Quality

- ✅ **TypeScript Strict Mode** - Maximum type safety
- ✅ **Biome** - Fast linting and formatting
- ✅ **Husky + lint-staged** - Pre-commit checks
- ✅ **Vitest** - Fast unit testing
- ✅ **AI Coding Rules** - Consistent patterns via Cursor

## License

MIT

## Support

For issues and questions:
- GitHub Issues: [Report a bug](https://github.com/yourusername/pws-base/issues)
- Documentation: [docs/](./docs/)

---

**Built with ❤️ using modern TypeScript stack**
