
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileUrl } = await req.json();
    
    if (!fileUrl) {
      return new Response(
        JSON.stringify({ error: "File URL is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Attempting to extract text from: ${fileUrl}`);
    
    // Create a Supabase client to access storage
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Download the file from the URL
    // Extract bucket name and file path from the URL
    const urlObj = new URL(fileUrl);
    const pathParts = urlObj.pathname.split('/');
    
    // The path format is typically /storage/v1/object/public/BUCKET_NAME/FILE_PATH
    // We need to find the index of 'public' to determine the bucket name and file path
    const publicIndex = pathParts.indexOf('public');
    
    if (publicIndex === -1 || publicIndex + 1 >= pathParts.length) {
      throw new Error("Invalid file URL format");
    }
    
    const bucketName = pathParts[publicIndex + 1];
    const filePath = pathParts.slice(publicIndex + 2).join('/');
    
    console.log(`Bucket: ${bucketName}, File path: ${filePath}`);
    
    // Download the file
    const { data: fileData, error: downloadError } = await supabaseClient
      .storage
      .from(bucketName)
      .download(filePath);
      
    if (downloadError) {
      throw new Error(`Error downloading file: ${downloadError.message}`);
    }
    
    if (!fileData) {
      throw new Error("File not found or is empty");
    }
    
    // Extract file extension
    const fileExtension = filePath.split('.').pop()?.toLowerCase();
    
    // Basic text extraction based on file type
    let extractedText = "";
    
    if (fileData) {
      if (fileExtension === 'pdf') {
        // For PDF files, we're using a simple text extraction approach
        // This is a very basic extraction that won't handle complex PDFs well
        const text = await fileData.text();
        
        // Remove PDF special characters and formatting
        extractedText = text
          .replace(/[\r\n]+/g, ' ')   // Replace line breaks with spaces
          .replace(/\s{2,}/g, ' ')    // Replace multiple spaces with single space
          .trim();
      } else if (['doc', 'docx'].includes(fileExtension || '')) {
        // For Word docs, extract as plaintext
        // This is a simple approach that treats the file as text
        // It won't correctly parse all Word document formats
        const text = await fileData.text();
        extractedText = text
          .replace(/[\r\n]+/g, ' ')
          .replace(/\s{2,}/g, ' ')
          .trim();
      } else {
        // For other file types, try to extract as plain text
        const text = await fileData.text();
        extractedText = text;
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        text: extractedText,
        fileType: fileExtension 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error("Error extracting text:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to extract text from document",
        success: false
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
