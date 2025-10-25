# Setup Guide

Complete installation and configuration guide for pws-base.

## Prerequisites

### Required Software

- **Bun** ≥1.2.2 - [Install Bun](https://bun.sh)
- **PostgreSQL** ≥14 - [Install PostgreSQL](https://www.postgresql.org/download/)
- **Node.js** ≥20 (for compatibility checking)
- **Git** - Version control

### Verify Installation

```bash
bun --version    # Should be ≥1.2.2
psql --version   # Should be ≥14
node --version   # Should be ≥20
```

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/pws-base.git
cd pws-base
```

### 2. Install Dependencies

```bash
bun install
```

This installs all dependencies for the monorepo (apps + packages).

### 3. Database Setup

#### Create Database

```bash
# Connect to PostgreSQL
psql postgres

# Create database
CREATE DATABASE "pws-base";

# Create user (optional)
CREATE USER pws_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE "pws-base" TO pws_user;

# Exit
\q
```

#### Configure Connection

```bash
# Copy environment template
cp apps/web/.env.example apps/web/.env.local

# Edit .env.local with your credentials
```

**apps/web/.env.local**:
```bash
# Database
DATABASE_URL="postgresql://pws_user:your_password@localhost:5432/pws-base"

# Authentication (generate secure secrets)
BETTER_AUTH_SECRET="your-32-character-minimum-secret-here"
BETTER_AUTH_URL="http://localhost:3000"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

#### Generate Secrets

```bash
# Generate BETTER_AUTH_SECRET (min 32 chars)
openssl rand -base64 32
```

### 4. Database Migrations

```bash
# Push schema to database (development)
bun run db:push

# Or generate and run migrations (production-ready)
bun run db:generate
bun run db:migrate
```

### 5. Verify Setup

```bash
# Type check
bun run check:types

# Lint
bun run check

# Open Drizzle Studio (optional - visual database explorer)
bun run db:studio
```

## Development Server

```bash
# Start all apps in development mode
bun run dev
```

Visit:
- **App**: http://localhost:3000
- **Drizzle Studio**: http://localhost:4983 (if running)

## IDE Setup

### VS Code / Cursor

Recommended extensions:
- **Biome** - Linting and formatting
- **TypeScript** - Language support
- **Tailwind CSS IntelliSense** - CSS completion

#### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "quickfix.biome": "explicit",
    "source.organizeImports.biome": "explicit"
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

### Cursor AI Rules

AI coding rules are automatically loaded from `.cursor/rules/`:
- `overview.mdc` - Project overview
- `typescript.mdc` - TypeScript standards
- `trpc.mdc` - tRPC patterns
- And more...

See `.cursor/rules/README.md` for details.

## Troubleshooting

### Database Connection Issues

**Error**: `connection refused`

```bash
# Check PostgreSQL is running
brew services list  # macOS
sudo systemctl status postgresql  # Linux

# Start PostgreSQL
brew services start postgresql  # macOS
sudo systemctl start postgresql  # Linux
```

**Error**: `authentication failed`

- Verify `DATABASE_URL` credentials in `.env.local`
- Check PostgreSQL user permissions

### Port Already in Use

**Error**: `Port 3000 is already in use`

```bash
# Find process using port
lsof -ti:3000

# Kill process
kill -9 $(lsof -ti:3000)

# Or use different port
PORT=3001 bun run dev
```

### TypeScript Errors

```bash
# Clean and reinstall
rm -rf node_modules
rm bun.lock
bun install

# Rebuild TypeScript
bun run check:types
```

### Bun Cache Issues

```bash
# Clear Bun cache
rm -rf ~/.bun/install/cache
bun install
```

## Production Setup

### Environment Variables

Create `apps/web/.env.production.local`:

```bash
# Production database
DATABASE_URL="postgresql://user:password@prod-host:5432/pws-base"

# Secure secrets (rotate regularly)
BETTER_AUTH_SECRET="production-secret-min-32-chars"
BETTER_AUTH_URL="https://yourdomain.com"

# Production URL
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
NODE_ENV="production"
```

### Database Migrations

```bash
# Generate migration
bun run db:generate

# Review migration files in packages/db/drizzle/

# Apply migrations
bun run db:migrate
```

### Build

```bash
# Build all packages
bun run build

# Start production server
bun run start
```

## Docker Setup (Optional)

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: pws-base
      POSTGRES_USER: pws_user
      POSTGRES_PASSWORD: your_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

```bash
# Start database
docker-compose up -d

# Use in .env.local
DATABASE_URL="postgresql://pws_user:your_password@localhost:5432/pws-base"
```

## Next Steps

- [Development Guide](./DEVELOPMENT.md) - Learn development workflows
- [API Documentation](./API.md) - Explore tRPC API
- [Architecture](./ARCHITECTURE.md) - Understand system design

## Getting Help

- Check [Troubleshooting](#troubleshooting) section
- Review [GitHub Issues](https://github.com/yourusername/pws-base/issues)
- Consult documentation in `docs/` directory
