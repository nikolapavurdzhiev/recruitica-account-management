
-- Create a storage bucket for candidate documents
INSERT INTO storage.buckets (id, name)
VALUES ('candidate-documents', 'candidate-documents')
ON CONFLICT DO NOTHING;

-- Set up security policies for the storage bucket
INSERT INTO storage.policies (name, definition, bucket_id)
VALUES (
  'Authenticated users can upload their own documents',
  '(bucket_id = ''candidate-documents'' AND auth.uid() = (storage.foldername(name))[1]::uuid)',
  'candidate-documents'
) ON CONFLICT DO NOTHING;

INSERT INTO storage.policies (name, definition, bucket_id)
VALUES (
  'Documents are publicly readable',
  '(bucket_id = ''candidate-documents'')',
  'candidate-documents'
) ON CONFLICT DO NOTHING;
