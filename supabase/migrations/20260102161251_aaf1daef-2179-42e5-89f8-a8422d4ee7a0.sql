-- Create storage bucket for resume
INSERT INTO storage.buckets (id, name, public) VALUES ('resume', 'resume', true);

-- Create policy for public read access
CREATE POLICY "Resume is publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'resume');

-- Create policy for uploads
CREATE POLICY "Anyone can upload resume"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'resume');

-- Create policy for updates
CREATE POLICY "Anyone can update resume"
ON storage.objects FOR UPDATE
USING (bucket_id = 'resume');

-- Create policy for deletes
CREATE POLICY "Anyone can delete resume"
ON storage.objects FOR DELETE
USING (bucket_id = 'resume');