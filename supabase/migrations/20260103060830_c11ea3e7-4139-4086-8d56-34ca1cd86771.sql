-- Add RLS policies for admin to manage newsletter subscribers

-- Allow reading all subscribers (for admin panel)
CREATE POLICY "Admin can read all subscribers"
ON public.newsletter_subscribers
FOR SELECT
USING (true);

-- Allow updating subscriber status (for admin panel)
CREATE POLICY "Admin can update subscribers"
ON public.newsletter_subscribers
FOR UPDATE
USING (true);

-- Allow deleting subscribers (for admin panel)
CREATE POLICY "Admin can delete subscribers"
ON public.newsletter_subscribers
FOR DELETE
USING (true);