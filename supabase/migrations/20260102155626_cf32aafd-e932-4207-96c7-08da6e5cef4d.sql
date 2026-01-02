-- Add policy for admin_settings (read-only for verification via edge function)
-- The actual admin operations will be handled by edge functions with service role
CREATE POLICY "Admin settings readable for verification" 
ON public.admin_settings 
FOR SELECT 
USING (true);