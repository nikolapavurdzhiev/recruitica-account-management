
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import ClientListPage from "./pages/ClientListPage";
import CandidateSubmitPage from "./pages/CandidateSubmitPage";
import CandidateClientSelectionPage from "./pages/CandidateClientSelectionPage";
import EmailTuneUpPage from "./pages/EmailTuneUpPage";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange={false}
      >
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/client-lists" element={<ClientListPage />} />
                <Route path="/client-lists/:id" element={<ClientListPage />} />
                <Route path="/candidate/submit" element={<CandidateSubmitPage />} />
                <Route path="/candidate/select-clients" element={<CandidateClientSelectionPage />} />
                <Route path="/email-tuneup/:candidateName" element={<EmailTuneUpPage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
