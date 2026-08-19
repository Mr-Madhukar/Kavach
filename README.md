# Kavach

Kavach is a comprehensive personal safety application designed to provide users with quick access to emergency services and tools.

## Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Setup environment variables:
   Create a `.env` file based on your configuration requirements.

3. Run development server:
   ```bash
   pnpm run dev
   ```
   This will start both the web frontend and API backend simultaneously.

## Workspace Structure

- `apps/web`: Next.js web application
- `apps/api`: Express/Node.js API
- `packages/db`: Shared database schema and utilities

## Scripts

- `pnpm run dev`: Start all apps
- `pnpm run build`: Build all apps
- `pnpm run lint`: Lint workspace
- `pnpm run test`: Run tests
