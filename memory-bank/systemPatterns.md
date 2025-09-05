# System Patterns - Recruitment Account Management System

## Architecture Overview

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Routing**: React Router DOM for client-side navigation
- **State Management**: 
  - React Context for authentication
  - TanStack Query for server state
  - Local state with useState for component-level data
- **Styling**: TailwindCSS with shadcn/ui components

### Backend Architecture
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth with email/password and Google OAuth
- **API**: Supabase Edge Functions for AI integration
- **External Services**: OpenRouter API for AI models, n8n workflows for email processing

## Key Design Patterns

### Component Architecture
- **Server Components**: Prefer React Server Components where possible
- **Client Components**: Minimize 'use client' to small, isolated components
- **Component Organization**: 
  - Feature-based folder structure
  - Reusable UI components in `/components/ui/`
  - Feature-specific components in dedicated folders

### Data Flow Patterns
- **Authentication Flow**: Context-based auth state management
- **Data Fetching**: TanStack Query for caching and synchronization
- **Form Handling**: React Hook Form with Zod validation
- **Error Handling**: Comprehensive error boundaries and user feedback

### State Management Patterns
- **Global State**: AuthContext for user authentication
- **Server State**: TanStack Query for API data
- **Local State**: useState for component-specific state
- **Form State**: React Hook Form for form management

## Database Schema Patterns

### Core Entities
- **candidates**: Candidate information and client associations
- **clients**: Company contact information
- **client_lists**: Organized groups of clients
- **client_list_entries**: Many-to-many relationship between clients and lists

### Relationships
- **User Scoping**: All data scoped to authenticated user
- **Foreign Keys**: Proper referential integrity
- **Timestamps**: Created/updated tracking on all entities

## API Integration Patterns

### Supabase Integration
- **Client Creation**: Type-safe Supabase client
- **Edge Functions**: Serverless functions for AI processing
- **Real-time**: Auth state changes and data updates

### External Service Integration
- **OpenRouter API**: AI model access with fallback mechanisms
- **n8n Workflows**: Webhook-based email processing
- **Error Handling**: Graceful degradation and user feedback

## Security Patterns

### Authentication
- **Session Management**: Automatic redirects and state persistence
- **User Scoping**: All data access scoped to authenticated user
- **API Security**: Secure API key management

### Data Protection
- **Input Validation**: Zod schemas for all form inputs
- **SQL Injection**: Supabase client handles parameterized queries
- **XSS Protection**: React's built-in XSS protection

## Performance Patterns

### Frontend Optimization
- **Code Splitting**: Lazy loading for route components
- **Caching**: TanStack Query for API response caching
- **Bundle Optimization**: Vite's built-in optimizations

### Backend Optimization
- **Edge Functions**: Serverless functions for AI processing
- **Database Indexing**: Proper indexing on frequently queried fields
- **Caching**: TanStack Query for client-side caching
