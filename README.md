# LifeOS

Your personal life app system. A monorepo containing the backend API, web application, and mobile app.

## 📁 Project Structure

```
lifeos/
│
├── 📦 backend/                    # Fastify API Server (TypeScript)
│   ├── src/
│   │   └── index.ts               # Main server entry point
│   ├── .env.example               # Environment template
│   ├── package.json               # Backend dependencies
│   └── tsconfig.json              # TypeScript config (extends base)
│
├── 🌐 frontend/                   # Next.js 15 Web App (App Router)
│   ├── src/
│   │   └── app/
│   │       ├── layout.tsx         # Root layout with Inter font
│   │       ├── page.tsx           # Homepage component
│   │       └── globals.css        # Design system & global styles
│   ├── .env.example               # Environment template
│   ├── next.config.mjs            # Next.js configuration
│   ├── package.json               # Frontend dependencies
│   └── tsconfig.json              # TypeScript config (extends base)
│
├── 📱 mobile/                     # React Native App (Expo SDK 52)
│   ├── app/
│   │   ├── _layout.tsx            # Root navigation stack
│   │   └── index.tsx              # Home screen
│   ├── assets/                    # App icons & splash images
│   ├── .env.example               # Environment template
│   ├── app.json                   # Expo configuration
│   ├── babel.config.js            # Babel preset for Expo
│   ├── package.json               # Mobile dependencies
│   └── tsconfig.json              # TypeScript config (extends base)
│
├── 📚 packages/                   # Shared Packages (coming soon)
│   └── (shared types, utils, validation schemas)
│
├── .gitignore                     # Git ignore rules
├── .nvmrc                         # Node version (22)
├── package.json                   # Root workspace scripts
├── pnpm-workspace.yaml            # Workspace configuration
├── tsconfig.base.json             # Shared TypeScript base config
└── README.md                      # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 22.0.0
- **pnpm** >= 9.0.0
- **Expo Go** app on your phone (for mobile development)

### Installation

```bash
# Install all dependencies
pnpm install

# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
cp mobile/.env.example mobile/.env
```

### Development

```bash
# Run all apps in parallel
pnpm dev

# Or run individually
pnpm dev:backend    # Backend at http://localhost:3001
pnpm dev:frontend   # Frontend at http://localhost:3000
pnpm dev:mobile     # Expo dev server
```

### Build

```bash
# Build all apps
pnpm build

# Or individually
pnpm build:backend
pnpm build:frontend
```
`
## 🛠️ Tech Stack

### Backend
- **Fastify** - Fast, low-overhead web framework
- **TypeScript** - Type-safe JavaScript
- **Zod** - Schema validation

### Frontend (Web)
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **Zustand** - State management
- **Vanilla CSS** - Custom design system

### Mobile
- **React Native** - Cross-platform mobile framework
- **Expo SDK 52** - Development platform
- **Expo Router** - File-based routing

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all apps for production |
| `pnpm lint` | Run linting across all packages |
| `pnpm typecheck` | Run TypeScript checks |
| `pnpm clean` | Clean all build artifacts |

## 🔧 Configuration

Each app has its own environment configuration:

- `backend/.env` - API server settings, database, storage
- `frontend/.env` - API URL, public keys
- `mobile/.env` - API URL for mobile app

## 📱 Mobile Development

```bash
# Start Expo development server
pnpm dev:mobile

# iOS Simulator
cd mobile && pnpm ios

# Android Emulator
cd mobile && pnpm android
```

## 🏗️ Architecture

The project follows a **modular monorepo** structure:

- **Controller-Service-Repository** pattern in the backend
- **App Router** with server/client components in the frontend
- **Expo Router** for file-based routing in mobile
- **Zod** for shared validation logic

---

Built with ❤️ using pnpm workspaces
