
# Recruitica - Candidate Management System

A modern recruitment management platform built with React, TypeScript, and Supabase for streamlined candidate submission and client management.

![Recruitica](https://i.ibb.co/xS4qLNK9/780x184.png)

## 🚀 Features

- **Authentication System**
  - Email/password authentication
  - Google OAuth integration
  - Secure session management with Supabase

- **Candidate Management**
  - Submit new candidates with detailed information
  - Client selection for candidate submissions
  - Email generation and tuning capabilities

- **Client Management**
  - Create and manage client lists
  - Advanced client search and filtering
  - Bulk client operations

- **Dashboard**
  - Overview of recruitment activities
  - Quick access to key features
  - Responsive design for all devices

- **Modern UI/UX**
  - Dark/light theme support
  - Responsive design with Tailwind CSS
  - Component library with shadcn/ui
  - Smooth animations and transitions

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (Authentication, Database, Edge Functions)
- **State Management**: TanStack Query, React Context
- **Routing**: React Router DOM
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Notifications**: Sonner

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Supabase account (for backend services)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd recruitica
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
- Comprehensive candidate forms
- Client selection workflow
- Email generation for outreach

### Client Management
- Create and organize client lists
- Advanced search and filtering
- Bulk operations support

### User Experience
- Intuitive navigation
- Responsive design
- Real-time feedback
- Error handling

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Conventional commits encouraged

### Adding New Features
1. Create focused, small components
2. Use TypeScript for all new code
3. Follow the existing folder structure
4. Add proper error handling
5. Test in both themes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary. All rights reserved.

## 🆘 Support

For support and questions:
- Check the [Lovable Documentation](https://docs.lovable.dev/)
- Join the [Lovable Discord Community](https://discord.com/channels/1119885301872070706/1280461670979993613)
- Review the codebase documentation

## 🔄 Version History

- **v1.0.0** - Initial release with core features
- Authentication system
- Candidate management
- Client list functionality
- Responsive UI/UX

---

Built with ❤️ using [Lovable](https://lovable.dev)
