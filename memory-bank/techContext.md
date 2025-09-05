# Technical Context - Recruitment Account Management System

## Technology Stack

### Frontend Technologies
- **React 18**: Latest stable version with concurrent features
- **TypeScript**: Full type safety throughout the application
- **Vite**: Fast build tool and development server
- **TailwindCSS**: Utility-first CSS framework
- **shadcn/ui**: Component library built on Radix UI primitives
- **React Router DOM**: Client-side routing
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form handling with validation
- **Zod**: Schema validation library

### Backend Technologies
- **Supabase**: Backend-as-a-Service platform
  - PostgreSQL database
  - Authentication service
  - Edge Functions (Deno runtime)
  - Real-time subscriptions
- **OpenRouter API**: AI model access and management
- **Mock Webhook System**: Portfolio-friendly email generation simulation

### Development Tools
- **ESLint**: Code linting and quality assurance
- **Prettier**: Code formatting
- **TypeScript**: Static type checking
- **Vite**: Development server and build tool

## Development Environment

### Prerequisites
- **Node.js**: v18 or higher
- **npm/yarn**: Package manager
- **Supabase Account**: For backend services
- **OpenRouter API Key**: For AI model access

### Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── candidate/      # Candidate-related components
│   ├── client-list/    # Client list components
│   └── client-search/  # Client search components
├── contexts/           # React contexts (Auth, etc.)
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
├── lib/                # Utility functions
├── pages/              # Route components
└── services/           # Business logic services
```

## AI Integration

### AI Models Supported
- **GPT-4o**: OpenAI's latest model
- **GPT-4o Mini**: Cost-effective GPT-4 variant
- **Claude 3 Opus**: Anthropic's most capable model
- **Claude 3 Sonnet**: Balanced performance and cost
- **Claude 3 Haiku**: Fast and efficient model
- **Llama 3 70B**: Meta's open-source model
- **Mistral Large**: Mistral AI's flagship model

### AI Service Architecture
- **OpenRouter Integration**: Unified API for multiple AI providers
- **Edge Functions**: Serverless AI processing
- **Fallback Mechanisms**: Graceful degradation when AI services fail
- **Custom Prompts**: Tailored system prompts for Nikola's communication style

## Database Schema

### Core Tables
- **candidates**: Stores candidate information and client associations
- **clients**: Company contact information
- **client_lists**: Organized groups of clients
- **client_list_entries**: Many-to-many relationship between clients and lists

### Key Features
- **User Scoping**: All data scoped to authenticated user
- **Timestamps**: Automatic created/updated tracking
- **Foreign Keys**: Proper referential integrity
- **Indexing**: Optimized for common query patterns

## Deployment & Infrastructure

### Hosting Platform
- **Lovable**: Primary deployment platform
- **Custom Domain**: Support for custom domain configuration
- **Environment Management**: Separate staging and production environments

### CI/CD Pipeline
- **Automatic Deployment**: Git-based deployment triggers
- **Environment Variables**: Secure configuration management
- **Build Optimization**: Vite's production optimizations

## Performance Considerations

### Frontend Performance
- **Code Splitting**: Route-based code splitting
- **Lazy Loading**: Dynamic imports for heavy components
- **Caching**: TanStack Query for API response caching
- **Bundle Size**: Optimized bundle with tree shaking

### Backend Performance
- **Edge Functions**: Serverless functions for AI processing
- **Database Optimization**: Proper indexing and query optimization
- **Caching**: Client-side caching for frequently accessed data
- **Error Handling**: Graceful degradation and retry mechanisms

## Security Measures

### Authentication Security
- **Supabase Auth**: Industry-standard authentication
- **Session Management**: Secure session handling
- **OAuth Integration**: Google OAuth support

### Data Security
- **Input Validation**: Zod schemas for all inputs
- **SQL Injection Protection**: Supabase client handles parameterized queries
- **XSS Protection**: React's built-in XSS protection
- **API Security**: Secure API key management
