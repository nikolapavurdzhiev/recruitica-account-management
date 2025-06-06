
import React from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-background border-b">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link to="/" className="font-semibold text-lg text-primary">
            Recruitica
          </Link>
          
          {user && (
            <nav className="hidden md:flex items-center space-x-4">
              <Button 
                variant={isActive("/") ? "default" : "ghost"} 
                size="sm" 
                asChild
              >
                <Link to="/">Dashboard</Link>
              </Button>
              <Button 
                variant={isActive("/candidate/submit") ? "default" : "ghost"} 
                size="sm" 
                asChild
              >
                <Link to="/candidate/submit">Submit Candidate</Link>
              </Button>
              <Button 
                variant={isActive("/client-lists") || location.pathname.startsWith("/client-lists/") ? "default" : "ghost"} 
                size="sm" 
                asChild
              >
                <Link to="/client-lists">Client Lists</Link>
              </Button>
            </nav>
          )}
        </div>
        
        <div>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {user.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
