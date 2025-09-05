
import React from "react";
import Header from "@/components/Header";
import CandidateForm from "@/components/CandidateForm";

const CandidateSubmitPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center py-8">
        <CandidateForm />
      </main>
      <footer className="py-6 border-t text-center text-sm text-muted-foreground">
        <div className="container">
          <p>© {new Date().getFullYear()} Recruitment Account Management System</p>
        </div>
      </footer>
    </div>
  );
};

export default CandidateSubmitPage;
