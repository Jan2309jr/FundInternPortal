# Overview

FundRaise Pro is a full-stack fundraising platform that allows interns to track donations, compete on leaderboards, and earn rewards based on their fundraising performance. The application features a React frontend with shadcn/ui components and an Express.js backend using PostgreSQL with Drizzle ORM for data management.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Forms**: React Hook Form with Zod validation

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Middleware**: Custom request logging and error handling
- **Development**: tsx for TypeScript execution in development

## Database Layer
- **Database**: PostgreSQL using Neon serverless database
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Schema Management**: Drizzle Kit for migrations and database operations
- **Connection**: Connection pooling with @neondatabase/serverless

## Data Models
- **Interns**: User profiles with referral codes and fundraising totals
- **Donations**: Transaction records linked to interns with donor information
- **Rewards**: Achievement system with thresholds and unlock status

## Authentication & Session Management
- **Authentication**: Simple email-based login (demo implementation)
- **Session Storage**: localStorage for client-side user data persistence
- **Authorization**: Basic route protection with redirect logic

## Development Environment
- **Monorepo Structure**: Client and server code in separate directories with shared schema
- **Build Process**: Vite for frontend, esbuild for backend compilation
- **Development Server**: Concurrent frontend and backend development with hot reload
- **Replit Integration**: Custom Vite plugins for Replit environment support

## Key Features
- **Dashboard**: Personal fundraising metrics, recent donations, and rewards progress
- **Leaderboard**: Ranking system showing all interns' performance
- **Reward System**: Unlockable achievements based on fundraising milestones
- **Referral Tracking**: Unique codes for each intern to track attribution

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Environment Variables**: DATABASE_URL for database connection configuration

## UI Component Libraries
- **Radix UI**: Headless UI primitives for accessibility and behavior
- **Lucide React**: Icon library for consistent iconography
- **shadcn/ui**: Pre-built component system with Tailwind CSS integration

## Development Tools
- **TanStack Query**: Server state synchronization and caching
- **Wouter**: Lightweight client-side routing
- **Drizzle Kit**: Database schema management and migration tools
- **Class Variance Authority**: Utility for managing component variants

## Build & Development
- **Vite**: Frontend build tool with React plugin support
- **esbuild**: Fast JavaScript bundler for backend compilation
- **PostCSS**: CSS processing with Tailwind CSS and Autoprefixer
- **TypeScript**: Type safety across the entire application stack