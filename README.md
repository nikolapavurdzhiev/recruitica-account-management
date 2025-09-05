
# Recruitment Candidate Management System

A modern, AI-powered recruitment management platform built with React, TypeScript, and Supabase. Streamlines candidate submission, client management, and email outreach with intelligent automation

## 🚀 Features

- **Authentication System**
  - Email/password authentication
  - Google OAuth integration
  - Secure session management with Supabase

- **AI-Powered Candidate Management**
  - Submit new candidates with detailed information
  - Client selection for candidate submissions
  - AI-powered email generation with multiple models (GPT-4, Claude, Llama, Mistral)
  - Interactive email tuning and refinement
  - Custom prompts tailored to communication style

- **Client Management**
  - Create and manage client lists
  - Advanced client search and filtering
  - Bulk client operations

- **Dashboard**
  - Overview of recruitment activities
  - Quick access to key features
  - Responsive design for all devices

- **Modern UI/UX**
  - Dark/light theme support with system preference detection
  - Responsive design with Tailwind CSS
  - Component library with shadcn/ui and Radix UI primitives
  - Smooth animations and transitions
  - Accessibility-first design (WCAG compliant)

## 🛠 Tech Stack

### Frontend
- **React 18** with concurrent features and server components
- **TypeScript** for full type safety
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** component library built on Radix UI primitives

### Backend & Services
- **Supabase** (PostgreSQL database, authentication, edge functions)
- **OpenRouter API** for AI model access (GPT-4, Claude, Llama, Mistral)
- **Mock Webhook System** for portfolio demonstration
- **Edge Functions** (Deno runtime) for serverless AI processing

### State Management & Data
- **TanStack Query** for server state management and caching
- **React Context** for global state (authentication)
- **React Hook Form** with Zod validation for forms
- **Real-time subscriptions** via Supabase

### Development Tools
- **ESLint** and **Prettier** for code quality
- **TypeScript** for static type checking
- **React Router DOM** for client-side routing
- **Lucide React** for icons
- **Sonner** for toast notifications

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Supabase account** (for backend services)
- **OpenRouter API key** (for AI model access)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd recruitment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENROUTER_API_KEY=your_openrouter_api_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:8080`

## 🏗 Project Structure

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

## 🔐 Authentication Setup

### Email/Password Authentication
The app uses Supabase Auth for secure email/password authentication. Users can register and sign in with their email credentials.

### Google OAuth Setup
1. Configure Google OAuth in your Supabase dashboard
2. Add your Google Client ID and Secret
3. Set up authorized redirect URIs
4. The app will automatically display the Google sign-in option

## 🤖 AI Integration Setup

### OpenRouter API Configuration
1. Sign up for an OpenRouter account at [openrouter.ai](https://openrouter.ai)
2. Generate an API key from your dashboard
3. Add the key to your environment variables
4. The app supports multiple AI models:
   - **GPT-4o** and **GPT-4o Mini** (OpenAI)
   - **Claude 3 Opus, Sonnet, and Haiku** (Anthropic)
   - **Llama 3 70B** (Meta)
   - **Mistral Large** (Mistral AI)

### AI Features
- **Email Generation**: AI-powered candidate outreach emails
- **Email Tuning**: Interactive chat interface for email refinement
- **Custom Prompts**: Tailored system prompts for specific communication styles
- **Fallback Handling**: Graceful degradation when AI services are unavailable

## ⚡ Performance & Architecture

### Frontend Performance
- **Code Splitting**: Route-based code splitting with Vite
- **Lazy Loading**: Dynamic imports for heavy components
- **Caching**: TanStack Query for intelligent API response caching
- **Bundle Optimization**: Tree shaking and optimized builds

### Backend Performance
- **Edge Functions**: Serverless AI processing with Deno
- **Database Optimization**: Proper indexing and query optimization
- **Real-time Updates**: Efficient real-time subscriptions
- **Error Recovery**: Automatic retry mechanisms and fallbacks

### Security Features
- **Input Validation**: Zod schemas for all user inputs
- **SQL Injection Protection**: Parameterized queries via Supabase
- **XSS Protection**: React's built-in XSS protection
- **Secure API Keys**: Environment-based configuration
- **User Data Scoping**: All data scoped to authenticated users

## 🎨 Theming

The application supports both dark and light themes with a comprehensive design system:

- **Colors**: Semantic color tokens defined in `index.css`
- **Components**: Consistent styling with CSS variables
- **Responsive**: Mobile-first design approach
- **Accessibility**: WCAG compliant color contrasts

## 🚀 Deployment

### Deploy to Lovable
1. Click the "Publish" button in the Lovable editor
2. Your app will be deployed to a Lovable subdomain

### Custom Domain
1. Navigate to Project > Settings > Domains in Lovable
2. Connect your custom domain (requires paid plan)

### Self-Hosting
After connecting to GitHub, you can deploy the app anywhere:

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting provider

Popular hosting options:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Firebase Hosting

## 📱 Features Overview

### Dashboard
- Quick access to candidate submission
- Client list management
- Activity overview

### Candidate Submission
- Comprehensive candidate forms with validation
- Client selection workflow with search and filtering
- AI-powered email generation for outreach
- Interactive email tuning and refinement

### Client Management
- Create and organize client lists
- Advanced search and filtering
- Bulk operations support

### User Experience
- Intuitive navigation with breadcrumbs
- Responsive design for all devices
- Real-time feedback with toast notifications
- Comprehensive error handling and loading states
- Accessibility-first design with keyboard navigation

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style
- **TypeScript** for full type safety
- **ESLint** for code quality and consistency
- **Prettier** for automatic code formatting
- **Conventional commits** encouraged
- **kebab-case** for component naming
- **Server Components** preferred over client components

### Adding New Features
1. Create focused, small components with kebab-case naming
2. Use TypeScript for all new code with strict typing
3. Follow the existing folder structure and patterns
4. Add proper error handling and loading states
5. Test in both light and dark themes
6. Use React Server Components when possible
7. Implement proper form validation with Zod
8. Add comprehensive error boundaries

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary. All rights reserved.

## 🆘 Support & Troubleshooting

### Common Issues

**AI Features Not Working**
- Verify your OpenRouter API key is correctly set in environment variables
- Check that you have sufficient credits in your OpenRouter account
- Ensure your internet connection is stable

**Authentication Issues**
- Verify Supabase URL and anon key are correct
- Check that Google OAuth is properly configured in Supabase dashboard
- Clear browser cache and cookies if experiencing login loops

**Build Errors**
- Ensure you're using Node.js v18 or higher
- Delete `node_modules` and run `npm install` again
- Check that all environment variables are properly set

### Getting Help
- Check the [Lovable Documentation](https://docs.lovable.dev/)
- Join the [Lovable Discord Community](https://discord.com/channels/1119885301872070706/1280461670979993613)
- Review the codebase documentation in `/memory-bank/`
- Check browser console for detailed error messages

## 🔄 Version History

- **v1.0.0** - Initial release with core features
  - Authentication system with Google OAuth
  - AI-powered candidate management
  - Client list functionality with advanced search
  - Responsive UI/UX with dark/light themes
  - Email generation and tuning capabilities
  - Real-time data synchronization
  - Comprehensive error handling

---

Built with ❤️ using [Lovable](https://lovable.dev)
