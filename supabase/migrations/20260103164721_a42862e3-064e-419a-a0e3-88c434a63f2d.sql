-- Create education table
CREATE TABLE public.education (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  degree TEXT NOT NULL,
  institution TEXT NOT NULL,
  period TEXT NOT NULL,
  grade TEXT,
  certificate_link TEXT,
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create experiences table
CREATE TABLE public.experiences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  period TEXT NOT NULL,
  responsibilities TEXT[] DEFAULT '{}'::text[],
  certificate_link TEXT,
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create certifications table
CREATE TABLE public.certifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date DATE,
  image TEXT,
  verification_link TEXT,
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create achievements table
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  link TEXT,
  icon_type TEXT DEFAULT 'Trophy',
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- RLS policies for education
CREATE POLICY "Education entries are publicly readable" 
ON public.education 
FOR SELECT 
USING (is_published = true);

-- RLS policies for experiences
CREATE POLICY "Experiences are publicly readable" 
ON public.experiences 
FOR SELECT 
USING (is_published = true);

-- RLS policies for certifications
CREATE POLICY "Certifications are publicly readable" 
ON public.certifications 
FOR SELECT 
USING (is_published = true);

-- RLS policies for achievements
CREATE POLICY "Achievements are publicly readable" 
ON public.achievements 
FOR SELECT 
USING (is_published = true);

-- Create triggers for updated_at
CREATE TRIGGER update_education_updated_at
BEFORE UPDATE ON public.education
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_experiences_updated_at
BEFORE UPDATE ON public.experiences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_certifications_updated_at
BEFORE UPDATE ON public.certifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_achievements_updated_at
BEFORE UPDATE ON public.achievements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed initial education data
INSERT INTO public.education (degree, institution, period, grade, display_order) VALUES
('M.Sc. Autonomous Systems', 'Hochschule Bonn-Rhein-Sieg, Germany', '2024 - Present', NULL, 1),
('B.Tech. Electronics & Communication Engineering', 'SRM Institute of Science and Technology, India', '2019 - 2023', 'CGPA: 9.17/10', 2),
('Intermediate Education', 'Narayana Junior College, India', '2017 - 2019', '95.7%', 3);

-- Seed initial experiences data
INSERT INTO public.experiences (title, company, period, responsibilities, display_order) VALUES
('Summer Trainee', 'Rashtriya Ispat Nigam Limited (RINL), Visakhapatnam', 'Jun 2022 - Jul 2022', ARRAY['Obtained hands-on experience with PLC and HMI configuration', 'Observed and analyzed the operations of steel manufacturing units', 'Applied theoretical knowledge to real-world industrial automation systems'], 1),
('Mechatronics Intern', 'Skill-Lync', 'Dec 2021 - Feb 2022', ARRAY['Designed and simulated IoT-based air quality monitoring systems', 'Developed an autonomous cleaning robot using simulation tools', 'Explored sensor integration and embedded systems programming'], 2);

-- Seed initial achievements data
INSERT INTO public.achievements (title, description, icon_type, display_order) VALUES
('Team Head - SPARC', 'Led technical team in robotics competitions', 'Users', 1),
('Vice-President, Robotics Club', 'Founding Member and Vice-President of University Robotics Club', 'Star', 2),
('Outstanding Student Publication Award', 'Recognized for research excellence with Elsevier publication', 'Award', 3),
('First Prize - Project Presentation', 'Srujanankura - A National Level Technical Fest', 'Trophy', 4),
('JASC 2024 - Top 5', 'Janatics India Private Limited Competition', 'Trophy', 5);