-- Create invite_codes table for admin registration
CREATE TABLE public.invite_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  used_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  used_at timestamp with time zone,
  expires_at timestamp with time zone,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.invite_codes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to validate invite codes (for signup)
CREATE POLICY "Anyone can validate invite codes"
ON public.invite_codes
FOR SELECT
USING (is_active = true AND used_by IS NULL AND (expires_at IS NULL OR expires_at > now()));

-- Admins can manage invite codes
CREATE POLICY "Admins can manage invite codes"
ON public.invite_codes
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create function to use invite code and assign admin role
CREATE OR REPLACE FUNCTION public.use_invite_code(p_code text, p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_invite_id uuid;
BEGIN
  -- Find and validate the invite code
  SELECT id INTO v_invite_id
  FROM public.invite_codes
  WHERE code = p_code
    AND is_active = true
    AND used_by IS NULL
    AND (expires_at IS NULL OR expires_at > now());
  
  IF v_invite_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Mark code as used
  UPDATE public.invite_codes
  SET used_by = p_user_id, used_at = now(), is_active = false
  WHERE id = v_invite_id;
  
  -- Assign admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (p_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN true;
END;
$$;

-- Insert a default invite code for first admin setup
INSERT INTO public.invite_codes (code, expires_at)
VALUES ('ADMIN-SETUP-2024', now() + interval '7 days');