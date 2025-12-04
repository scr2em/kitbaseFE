# FlywayFE

A modern React application built with TypeScript, Vite, Mantine UI, and React Query.

## Features

- 🎨 **Professional SaaS UI** - Modern, polished interface with gradient designs and premium feel
- 🌐 **Internationalization (i18n)** - Multi-language support with react-i18next (currently English)
- 🔐 **Authentication** - Complete auth flow with login, signup, and JWT token management
- 💎 **Mantine UI** - Premium components with consistent design system
- 📱 **Responsive Design** - Mobile-first approach with breakpoint-based layouts
- 🏗️ **Feature Slice Pattern** - Well-organized architecture
- ✨ **Form Validation** - Using react-hook-form with Zod schemas
- 🔄 **API Integration** - Type-safe API client generated from OpenAPI specs
- 🚀 **React Query** - Efficient data fetching and caching
- 🎯 **Lucide Icons** - Beautiful, consistent icon system

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Mantine** - UI component library
- **React Router** - Client-side routing
- **React Query** - Server state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Axios** - HTTP client
- **i18next** - Internationalization
- **Lucide React** - Icon library

## Project Structure

```
src/
├── app/                    # Application layer
│   ├── providers/         # Global providers (Theme, Query, Auth)
│   └── routes/            # Route configuration
├── features/              # Feature-based modules
│   ├── auth/
│   │   ├── login/
│   │   │   ├── model/    # Validation schemas
│   │   │   └── ui/       # UI components
│   │   └── signup/
│   │       ├── model/
│   │       └── ui/
│   └── dashboard/
│       └── ui/
├── shared/                # Shared resources
│   ├── api/
│   │   ├── client.ts     # API client with interceptors
│   │   └── queries/      # React Query hooks
│   ├── i18n/
│   │   ├── config.ts     # i18n configuration
│   │   └── locales/      # Translation files
│   └── lib/
│       ├── auth/         # Auth context
│       └── router/       # Route guards
└── generated-api.ts       # Auto-generated from OpenAPI
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd FlywayFE
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update the API URL in `.env`:
```
VITE_API_URL=http://localhost:8080/api
```

### Development

Start the development server:
```bash
pnpm dev
```

The application will be available at `http://localhost:5173`

### Build

Build for production:
```bash
pnpm build
```

Preview production build:
```bash
pnpm preview
```

### Linting

Run ESLint:
```bash
pnpm lint
```

## API Code Generation

The project uses `swagger-typescript-api` to generate type-safe API clients from OpenAPI specifications.

To regenerate the API client:
```bash
pnpm api
```

This will read `openapi.yaml` and generate `src/generated-api.ts`.

## Available Pages

### 🔐 Authentication Pages
- `/login` - User login page with gradient background and modern form design
- `/signup` - User registration page with enhanced UX

### 📊 Dashboard
- `/dashboard` - Protected dashboard featuring:
  - Professional header with navigation
  - Stats cards (Projects, Team Members, Revenue, Organizations)
  - User information grid with color-coded icons
  - Quick action buttons
  - User profile menu with dropdown

## Authentication Flow

1. User logs in or signs up
2. JWT tokens (access + refresh) are stored in localStorage
3. API client automatically includes access token in requests
4. If access token expires, the refresh token is used automatically
5. If refresh token expires, user is redirected to login

## Adding New Features

Follow the Feature Slice Design pattern:

1. Create a new feature folder under `src/features/`
2. Organize by layers: `model/`, `ui/`, `api/`
3. Add queries/mutations in `src/shared/api/queries/`
4. Update translations in `src/shared/i18n/locales/en.json`
5. Use contextual IDs for i18n keys

## Code Guidelines

- ✅ Use React Hook Form with Zod for forms
- ✅ Define Zod schemas outside components
- ✅ Use React Query for all API calls
- ✅ Use contextual i18n keys (not literal text)
- ✅ Use Mantine components for layout
- ✅ Use Lucide icons for all icons
- ✅ Follow responsive design principles
- ✅ Use TypeScript strict mode
- ✅ Use type-only imports for types
- ✅ Follow the established color scheme and gradients
- ✅ Use consistent spacing and sizing scales

## Deployment

This application can be deployed to AWS Amplify using AWS CDK and GitHub Actions for CI/CD.

### Quick Start

See the comprehensive [Deployment Guide](DEPLOYMENT.md) for detailed instructions.

### Infrastructure

The infrastructure is managed using AWS CDK with TypeScript:

```bash
cd infrastructure
pnpm install
pnpm run deploy
```

### Environments

- **Development**: `dev` branch → https://dev.yourdomain.com
- **Staging**: `staging` branch → https://staging.yourdomain.com  
- **Production**: `main` branch → https://app.yourdomain.com

### CI/CD

Automated deployments via GitHub Actions:
- Push to `dev`, `staging`, or `main` triggers automatic deployment
- Pull requests run lint and build checks
- See [GitHub Secrets Configuration](.github/GITHUB_SECRETS.md)

For detailed deployment instructions, troubleshooting, and configuration, see:
- [📖 Deployment Guide](DEPLOYMENT.md)
- [🔐 GitHub Secrets Setup](.github/GITHUB_SECRETS.md)
- [🏗️ Infrastructure README](infrastructure/README.md)

## Contributing

1. Create a feature branch
2. Make your changes
3. Ensure tests pass and linter is happy
4. Submit a pull request

## License

[Your License Here]
