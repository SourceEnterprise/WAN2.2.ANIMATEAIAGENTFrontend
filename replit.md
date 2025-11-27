# Photo & Video Upload Application

## Overview

This is a file upload application built with React (frontend) and Express (backend) that allows users to upload photos and videos. The application forwards uploaded files to an n8n webhook for further processing. It features a Material Design-inspired interface with drag-and-drop file upload capabilities, file validation, and real-time upload feedback.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server for fast HMR (Hot Module Replacement)
- **Wouter** for lightweight client-side routing (instead of React Router)
- **TanStack Query** (React Query) for server state management and API request handling

**UI Component Library**
- **shadcn/ui** component system built on Radix UI primitives
- **Tailwind CSS** for utility-first styling with custom design tokens
- Material Design principles (simplified) for form interactions and feedback
- Custom CSS variables for theming (light mode configured, dark mode infrastructure present)

**Form & Validation**
- File upload validation using Zod schemas
- Client-side file type and size validation (photos up to 10MB, videos up to 100MB)
- Drag-and-drop interface with file preview capabilities
- React hooks for managing file state and upload mutations

**Design System**
- Typography: Inter font (Google Fonts)
- Spacing: Tailwind's spacing scale (2, 4, 6, 8, 12, 16, 24)
- Component hierarchy: Card-based layout with centered container (max-w-2xl)
- Responsive design with mobile-first approach

### Backend Architecture

**Server Framework**
- **Express.js** for HTTP server and routing
- Node.js with ES modules (type: "module")
- TypeScript for type safety across the stack
- HTTP server created via Node's `createServer` for potential WebSocket upgrades

**File Upload Processing**
- **Multer** middleware for multipart/form-data handling
- Memory storage strategy (files stored in buffer, not disk)
- Support for multiple file fields (photo and video)
- 100MB file size limit configured at the middleware level

**API Endpoint**
- `POST /api/upload` - Accepts photo and/or video files via multipart form data
- Validates that at least one file is provided
- Forwards files to external n8n webhook using axios and form-data
- Returns success/error responses with appropriate HTTP status codes

**Build & Deployment**
- Custom build script using esbuild for server bundling
- Allowlist-based dependency bundling to optimize cold start times
- Static file serving for production builds
- Development mode with Vite middleware integration

### Data Storage

**Current Implementation**
- In-memory storage (`MemStorage` class) for user data
- Interface-based storage abstraction (`IStorage`) for future database integration
- No persistent database currently configured

**Database Infrastructure (Configured but Unused)**
- Drizzle ORM configured for PostgreSQL
- Database connection via `@neondatabase/serverless`
- Schema defined in `shared/schema.ts`
- Migration setup pointing to PostgreSQL dialect
- Note: The application has Drizzle configured but does not currently use a database for core functionality

### External Dependencies

**Third-Party Services**
- **n8n Webhook** - Primary integration point for file processing
  - Configured via `N8N_WEBHOOK_URL` environment variable
  - Receives uploaded files via HTTP POST with multipart/form-data
  - Application forwards both photo and video files with original filenames and content types

**Cloud Services**
- **Neon Database** - PostgreSQL hosting (configured via Drizzle but not actively used)
  - Connection via `DATABASE_URL` environment variable
  - Serverless PostgreSQL database

**Development Tools**
- **Replit-specific plugins** for development environment integration
  - Runtime error overlay
  - Cartographer (development tool)
  - Development banner

**UI & Styling**
- **Google Fonts** - Inter font family for typography
- **Radix UI** - Comprehensive set of unstyled UI primitives (accordion, dialog, dropdown, toast, etc.)
- **Lucide React** - Icon library for UI elements (ImageIcon, VideoIcon, Upload, etc.)

**Utilities**
- **clsx** and **tailwind-merge** - Utility for conditional CSS class handling
- **class-variance-authority** - Type-safe variant API for component styling
- **date-fns** - Date manipulation library
- **nanoid** - Unique ID generation
- **zod** - Schema validation for runtime type checking