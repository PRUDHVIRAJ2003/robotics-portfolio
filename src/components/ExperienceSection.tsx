import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { Briefcase, Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  responsibilities: string[];
  certificate_link: string | null;
}

const ExperienceSection = () => {
  const [experienceData, setExperienceData] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .eq("is_published", true)
        .order("display_order", { ascending: true });

      if (!error && data) {
        setExperienceData(data);
      }
      setLoading(false);
    };

    fetchExperiences();
  }, []);

  if (loading) {
    return (
      <section id="experience" className="py-20 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (experienceData.length === 0) {
    return null;
  }

  return (
    <section id="experience" className="py-20 bg-background relative overflow-hidden">
      <div className="absolute inset-0 circuit-pattern opacity-10" />
      
      <div className="container mx-auto px-4 relative">
        <AnimateOnScroll animation="fade-up">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-gradient-primary">Experience</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              My professional journey in robotics and automation
            </p>
          </div>
        </AnimateOnScroll>

        <div className="max-w-4xl mx-auto space-y-8">
          {experienceData.map((exp, index) => (
            <AnimateOnScroll key={exp.id} animation="fade-up" delay={index * 150}>
              <div className="relative pl-8 border-l-2 border-primary/30 hover:border-primary transition-colors duration-300">
                <div className="absolute left-0 top-0 w-4 h-4 -translate-x-1/2 rounded-full bg-primary shadow-glow" />
                
                <div className="bg-card rounded-xl p-6 shadow-card hover:shadow-elevated transition-all duration-300 border border-border hover:border-primary/30 group ml-4">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
                        <Briefcase className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{exp.title}</h3>
                        <p className="text-muted-foreground">{exp.company}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-primary font-mono text-sm bg-primary/10 px-3 py-1 rounded-full">
                      <Calendar className="w-4 h-4" />
                      {exp.period}
                    </div>
                  </div>
                  
                  {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <ul className="space-y-2 mb-4">
                      {exp.responsibilities.map((resp, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-muted-foreground">
                          <div className="w-2 h-2 rounded-full bg-secondary mt-2 flex-shrink-0" />
                          {resp}
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  {exp.certificate_link && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={exp.certificate_link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3 mr-2" />
                        View Certificate
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
