import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Download, Github, Linkedin, Mail } from "lucide-react";
import profilePhoto from "@/assets/photo.png";

const HeroSection = () => {
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchResume = async () => {
      const { data } = await supabase.storage.from("resume").list();
      if (data && data.length > 0) {
        const { data: urlData } = supabase.storage.from("resume").getPublicUrl(data[0].name);
        setResumeUrl(urlData.publicUrl);
      }
    };
    fetchResume();
  }, []);

  return (
    <section
      id="home"
      className="min-h-screen relative flex items-center justify-center gradient-hero overflow-hidden pt-16"
    >
      {/* Background effects */}
      <div className="absolute inset-0 circuit-pattern opacity-20" />
      <div className="absolute inset-0 tech-grid" />
      
      {/* Floating particles */}
      <div className="absolute top-20 left-10 w-3 h-3 bg-primary rounded-full animate-float opacity-60" />
      <div className="absolute top-40 right-20 w-2 h-2 bg-secondary rounded-full animate-float opacity-60" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-40 left-1/4 w-4 h-4 bg-accent rounded-full animate-float opacity-40" style={{ animationDelay: "2s" }} />
      <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-primary rounded-full animate-float opacity-60" style={{ animationDelay: "0.5s" }} />

      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Photo with aura effect */}
          <div className="relative animate-slide-up">
            {/* Aura glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-secondary to-accent blur-3xl opacity-50 scale-110 animate-pulse-glow" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-secondary blur-2xl opacity-30 scale-125" />
            
            {/* Photo container */}
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary/30 animate-float">
              <img
                src={profilePhoto}
                alt="Prudhvi Raj Chalapaka"
                className="w-full h-full object-cover object-top"
              />
            </div>
            
            {/* Decorative rings */}
            <div className="absolute -inset-4 rounded-full border-2 border-primary/20 animate-spin" style={{ animationDuration: "20s" }} />
            <div className="absolute -inset-8 rounded-full border border-secondary/10 animate-spin" style={{ animationDuration: "30s", animationDirection: "reverse" }} />
          </div>

          {/* Content */}
          <div className="text-center lg:text-left animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <p className="text-primary font-mono text-sm mb-2 tracking-widest uppercase">
              Hello, I am
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span className="text-card-foreground">Prudhvi Raj</span>
              <br />
              <span className="text-gradient-primary">Chalapaka</span>
            </h1>
            <h2 className="text-xl md:text-2xl text-muted-foreground mb-6">
              Robotics & Automation Engineer
            </h2>
            <p className="text-muted-foreground max-w-xl mb-8 leading-relaxed">
              Ambitious engineer with a strong foundation in ROS/ROS2, Industrial Automation, 
              and autonomous navigation. Combining hands-on experience in simulation and 
              embedded systems to advance autonomy technologies.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8">
              <Button variant="hero" size="xl" asChild>
                <a href={resumeUrl || "#"} download target="_blank" rel="noopener noreferrer">
                  <Download className="w-5 h-5" />
                  Download Resume
                </a>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <a href="#contact">
                  Contact Me
                </a>
              </Button>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 justify-center lg:justify-start">
              <a
                href="https://linkedin.com/in/prudhvirajchalapaka"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-all duration-300 hover:shadow-glow"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/prudhvirajchalapaka"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-all duration-300 hover:shadow-glow"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="mailto:me@prudhvirajchalapaka.in"
                className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-all duration-300 hover:shadow-glow"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-muted-foreground text-xs font-mono">Scroll</span>
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
          <div className="w-1 h-3 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
