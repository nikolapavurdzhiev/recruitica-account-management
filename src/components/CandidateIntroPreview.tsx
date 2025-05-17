
import React from "react";

interface CandidateIntroPreviewProps {
  html: string;
}

const CandidateIntroPreview: React.FC<CandidateIntroPreviewProps> = ({ html }) => {
  return (
    <div className="bg-white rounded-lg border overflow-hidden h-[600px] overflow-y-auto">
      <iframe
        title="Candidate Introduction Preview"
        srcDoc={html}
        className="w-full h-full border-0"
        sandbox="allow-same-origin"
      />
    </div>
  );
};

export default CandidateIntroPreview;
