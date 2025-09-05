# Project Brief - Recruitment Account Management System

## Project Overview
Recruitment is a modern recruitment management platform designed specifically for Nikola, a Partner at Recruitment (a global rec-to-rec recruiter). The system streamlines the candidate submission and client management workflow with AI-powered email generation and tuning capabilities.

## Core Purpose
- **Primary Goal**: Streamline the recruitment process from candidate submission to client outreach
- **Target User**: Nikola (Partner at Recruitment) and other recruitment professionals
- **Business Value**: Automate and enhance the candidate-to-client introduction process

## Key Requirements

### Functional Requirements
1. **Candidate Management**
   - Submit new candidates with detailed information
   - Store candidate data with keynotes and attachments
   - Track candidate submissions and status

2. **Client Management**
   - Create and organize client lists
   - Advanced client search and filtering
   - Bulk client operations and management

3. **AI-Powered Email Generation**
   - Generate professional introduction emails
   - AI-powered email tuning and refinement
   - Multiple AI model support (GPT-4, Claude, Llama, etc.)
   - Interactive chat interface for email improvements

4. **Authentication & Security**
   - Secure user authentication (email/password + Google OAuth)
   - User-scoped data access
   - Session management

### Technical Requirements
- **Frontend**: React 18, TypeScript, Vite, TailwindCSS, shadcn/ui
- **Backend**: Supabase (Auth, Database, Edge Functions)
- **AI Integration**: OpenRouter API for multiple AI models
- **External Services**: n8n workflows for email processing
- **Deployment**: Lovable platform integration

## Success Criteria
- Seamless candidate submission workflow
- Efficient client list management
- High-quality AI-generated emails
- Intuitive user experience
- Reliable authentication and data security
- Responsive design for all devices

## Project Scope
- **In Scope**: Candidate management, client management, AI email generation, authentication
- **Out of Scope**: Payment processing, advanced analytics, multi-user collaboration features
