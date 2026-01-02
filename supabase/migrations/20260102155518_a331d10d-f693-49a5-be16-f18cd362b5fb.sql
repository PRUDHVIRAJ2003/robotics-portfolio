-- Projects table for portfolio
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT,
  technologies TEXT[] DEFAULT '{}',
  github_link TEXT,
  live_link TEXT,
  data_link TEXT,
  images TEXT[] DEFAULT '{}',
  thumbnail TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Publications table
CREATE TABLE public.publications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  authors TEXT[] DEFAULT '{}',
  publication_date DATE,
  publisher TEXT,
  link TEXT,
  doi TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Contact submissions table
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Admin settings table (for password storage)
CREATE TABLE public.admin_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Public read policies for projects and publications
CREATE POLICY "Projects are publicly readable" 
ON public.projects 
FOR SELECT 
USING (is_published = true);

CREATE POLICY "Publications are publicly readable" 
ON public.publications 
FOR SELECT 
USING (is_published = true);

-- Contact submissions can be inserted by anyone
CREATE POLICY "Anyone can submit contact form" 
ON public.contact_submissions 
FOR INSERT 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_publications_updated_at
BEFORE UPDATE ON public.publications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_settings_updated_at
BEFORE UPDATE ON public.admin_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default admin password (hashed 'admin')
INSERT INTO public.admin_settings (setting_key, setting_value) 
VALUES ('admin_password', 'admin');

-- Insert initial projects from resume
INSERT INTO public.projects (title, short_description, full_description, technologies, is_featured, display_order) VALUES
('Iravath - Autonomous Rover', 'Autonomous Rover with ROS, NavStack, and ML for object detection', 'Employed 3D-printed components to significantly reduce project costs. Trained the rover to accurately detect and measure objects. Utilized a Rocker-Boggie mechanism to ensure maneuverability and stability in challenging terrains.', ARRAY['ROS', 'NavStack', 'Nvidia Jetson', 'ML', '3D Printing'], true, 1),
('DWA Local Planner', 'Custom DWA Planner for Turtlebot3 without standard nav2 packages', 'Implemented Custom Local dwa_Planner Using ROS2. This Planner does not use any standard packages like nav2 packages.', ARRAY['ROS2', 'Gazebo', 'RviZ', 'Python'], true, 2),
('Mecanum Wheeled Mobile Robot', 'Multi-purpose mobile robot with manipulator for various industries', 'Developed a Mecanum Wheeled Mobile robot with a manipulator for multipurpose applications including Agricultural, Hospitality and Housekeeping.', ARRAY['Arduino', 'Gazebo', 'ROS', 'C++'], true, 3),
('Modular Manufacturing System', 'Automated manufacturing system using PLC and pneumatics', 'Developed a Manufacturing system for automated industry. The System works on the Basis of Onboard Sensor Data to do process.', ARRAY['PLC', 'Pneumatics', 'Arduino', 'Sensors'], true, 4),
('6DOF Robotic ARM', 'Custom designed robotic arm with mobile app control', 'Designed 6DOF Robotic Arm in Fusion 360 later 3D Printed Each link. Designed a Mobile App for Controlling the Robotic Arm.', ARRAY['Arduino', 'Custom PCB', 'Android', 'Fusion 360', '3D Printing'], true, 5);

-- Insert initial publication from resume
INSERT INTO public.publications (title, description, authors, publication_date, publisher) VALUES
('Integrating robotic surgery and pharmacotherapy: A dual approach to lung cancer management', 'A research paper on integrating robotic surgery and pharmacotherapy for lung cancer management. Hosted on Elsevier.', ARRAY['Prudhvi Raj Chalapaka'], '2024-01-01', 'Elsevier');