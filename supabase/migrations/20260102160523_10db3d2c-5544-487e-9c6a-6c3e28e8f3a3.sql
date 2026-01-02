-- Create storage bucket for project images
INSERT INTO storage.buckets (id, name, public) VALUES ('project-images', 'project-images', true);

-- Create policy for public read access
CREATE POLICY "Project images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-images');

-- Create policy for admin uploads (anyone can upload for now, secured by admin panel)
CREATE POLICY "Anyone can upload project images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'project-images');

-- Create policy for admin deletes
CREATE POLICY "Anyone can delete project images"
ON storage.objects FOR DELETE
USING (bucket_id = 'project-images');