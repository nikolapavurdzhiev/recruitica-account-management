
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EmailPreviewProps {
  htmlContent: string;
  className?: string;
}

const EmailPreview: React.FC<EmailPreviewProps> = ({ htmlContent, className = "" }) => {
  return (
    <Card className={`h-full ${className}`}>
      <CardContent className="p-0 h-full">
        <ScrollArea className="h-full">
          <div className="p-4">
            <iframe
              srcDoc={htmlContent}
              className="w-full min-h-[600px] border-0 rounded-md"
              title="Email Preview"
              sandbox="allow-same-origin"
              style={{ backgroundColor: '#f4f4f4' }}
            />
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default EmailPreview;
