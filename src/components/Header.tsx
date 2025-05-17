
import React from "react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={cn("w-full py-6 border-b", className)}>
      <div className="container flex items-center">
        <img 
          src="/lovable-uploads/eaac4d0b-430c-48bc-873b-41f29060675d.png" 
          alt="Recruitica Logo" 
          className="h-10 sm:h-12" 
        />
      </div>
    </header>
  );
};

export default Header;
