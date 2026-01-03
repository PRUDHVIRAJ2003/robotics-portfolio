import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { GraduationCap, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Education {
  id: string;
  degree: string;
  institution: string;
  period: string;
  grade: string | null;
  certificate_link: string | null;
}

const EducationSection = () => {
  const [educationData, setEducationData] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEducation = async () => {
      const { data, error } = await supabase
        .from("education")
        .select("*")
        .eq("is_published", true)
        .order("display_order", { ascending: true });

      if (!error && data) {
        setEducationData(data);
      }
      setLoading(false);
    };

    fetchEducation();
  }, []);

  if (loading) {
    return (
      <section id="education" className="py-20 bg-card relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (educationData.length === 0) {
    return null;
  }

  return (
    <section id="education" className="py-20 bg-card relative overflow-hidden">
      <div className="absolute inset-0 tech-grid opacity-30" />
      
      <div className="container mx-auto px-4 relative">
        <AnimateOnScroll animation="fade-up">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-gradient-primary">Education</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              My academic journey in the field of robotics and automation
            </p>
          </div>
        </AnimateOnScroll>

        <div className="max-w-4xl mx-auto px-2 sm:px-0">
          <div className="relative">
            {/* Timeline line - hidden on mobile, centered on larger screens */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent -translate-x-1/2" />

            {educationData.map((edu, index) => (
              <AnimateOnScroll
                key={edu.id}
                animation="fade-up"
                delay={index * 150}
              >
                <div
                  className={`relative flex items-center mb-8 md:mb-12 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Timeline dot - hidden on mobile */}
                  <div className="hidden md:block absolute left-1/2 w-4 h-4 -translate-x-1/2 rounded-full bg-primary shadow-glow z-10" />

                  {/* Card container */}
                  <div
                    className={`w-full md:w-[calc(50%-2rem)] ${
                      index % 2 === 0 ? "md:pr-8 lg:pr-12 md:text-right" : "md:pl-8 lg:pl-12"
                    }`}
                  >
                    <div className="bg-background rounded-xl p-4 sm:p-5 lg:p-6 shadow-card hover:shadow-elevated transition-all duration-300 border border-border hover:border-primary/30 group">
                      {/* Header with icon and period */}
                      <div className={`flex items-center gap-2 sm:gap-3 mb-3 flex-wrap ${index % 2 === 0 ? "md:justify-end" : ""}`}>
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg gradient-primary flex items-center justify-center group-hover:shadow-glow transition-all duration-300 flex-shrink-0">
                          <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
                        </div>
                        <span className="text-primary font-mono text-xs sm:text-sm">{edu.period}</span>
                      </div>
                      
                      {/* Degree title */}
                      <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-2 leading-tight">{edu.degree}</h3>
                      
                      {/* Institution */}
                      <p className={`text-muted-foreground flex items-center gap-2 mb-2 text-xs sm:text-sm ${index % 2 === 0 ? "md:justify-end" : ""}`}>
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="break-words">{edu.institution}</span>
                      </p>
                      
                      {/* Grade */}
                      {edu.grade && <p className="text-primary font-semibold text-sm sm:text-base">{edu.grade}</p>}
                      
                      {/* Certificate Link */}
                      {edu.certificate_link && (
                        <div className={`mt-3 ${index % 2 === 0 ? "md:text-right" : ""}`}>
                          <Button variant="outline" size="sm" asChild>
                            <a href={edu.certificate_link} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-3 h-3 mr-2" />
                              View Certificate
                            </a>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
