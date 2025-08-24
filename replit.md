# SDG Impact Platform

## Overview

The SDG Impact Platform is a full-stack web application that connects users with verified NGOs working on UN Sustainable Development Goals (SDGs). The platform features blockchain verification, AI-powered recommendations, and real-time project tracking. Built with a modern TypeScript stack, it enables transparent, accountable impact measurement for social good initiatives.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript and Vite for fast development and hot reloading
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design system
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Query (TanStack Query) for server state, React hooks for local state
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **UI Components**: Radix UI primitives wrapped with custom styling

### Backend Architecture
- **Framework**: Express.js with TypeScript for the REST API server
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: Replit Auth integration with session management
- **File Uploads**: Multer middleware for handling image uploads
- **API Design**: RESTful endpoints with structured error handling and logging

### Database Design
- **ORM**: Drizzle with PostgreSQL dialect for schema management
- **Key Tables**: Users, NGOs, Projects, Recommendations, Blockchain Verifications
- **Relationships**: Well-structured foreign key relationships between entities
- **Session Storage**: Built-in session table for authentication persistence
- **Migration System**: Drizzle Kit for database schema migrations

### Authentication & Authorization
- **Provider**: Replit Auth with OpenID Connect integration
- **Session Management**: PostgreSQL-backed sessions with configurable TTL
- **Security**: HTTP-only cookies, CSRF protection, secure session storage
- **User Management**: Automatic user creation/update on authentication

### AI Integration
- **Provider**: OpenAI GPT-4o for intelligent recommendations
- **Features**: Problem analysis, NGO matching, impact estimation
- **Content Analysis**: Automated SDG categorization and urgency assessment
- **Recommendation Engine**: Machine learning-based project-NGO matching

## External Dependencies

### Core Infrastructure
- **Database**: Neon PostgreSQL serverless database
- **Authentication**: Replit Auth service for user management
- **File Storage**: Local file system with Multer (configurable for cloud storage)

### AI Services
- **OpenAI**: GPT-4o API for natural language processing and recommendations
- **Features**: Text analysis, categorization, impact estimation, smart matching

### Blockchain Integration
- **Network**: Polygon Mumbai testnet (configurable)
- **Purpose**: Impact verification and transparency
- **Smart Contracts**: Custom impact proof storage (simulated in current implementation)

### Third-Party APIs
- **Web3**: Ethereum integration for wallet connectivity
- **Maps**: Location-based project matching and visualization
- **SDG Data**: UN SDG goal integration and categorization

### Development Tools
- **Vite**: Frontend build tool with React plugin
- **TypeScript**: Full-stack type safety
- **Tailwind CSS**: Utility-first styling framework
- **Drizzle Kit**: Database migration and schema management
- **React Query**: Server state management and caching