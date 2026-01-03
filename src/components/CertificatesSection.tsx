import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { Award, ExternalLink, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Certification {
  id: string;
  title: string;
  issuer: string;
  issue_date: string | null;
  image: string | null;
  verification_link: string | null;
}

const CertificatesSection = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertifications = async () => {
      const { data, error } = await supabase
        .from("certifications")
        .select("*")
        .eq("is_published", true)
        .order("display_order", { ascending: true });

      if (!error && data) {
        setCertifications(data);
      }
      setLoading(false);
    };

    fetchCertifications();
  }, []);

  if (loading) {
    return (
      <section id="certificates" className="py-20 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (certifications.length === 0) {
    return null;
  }

  return (
    <section id="certificates" className="py-20 bg-background relative overflow-hidden">
      <div className="absolute inset-0 circuit-pattern opacity-10" />
      
      <div className="container mx-auto px-4 relative">
        <AnimateOnScroll animation="fade-up">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-gradient-primary">Certifications</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Professional certifications and credentials
            </p>
          </div>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, index) => (
            <AnimateOnScroll key={cert.id} animation="fade-up" delay={index * 100}>
              <div className="bg-card rounded-xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 border border-border hover:border-primary/30 group h-full flex flex-col">
                {cert.image ? (
                  <div className="relative overflow-hidden">
                    <img 
                      src={cert.image} 
                      alt={cert.title} 
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-muted flex items-center justify-center">
                    <Award className="w-16 h-16 text-muted-foreground/30" />
                  </div>
                )}
                
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                    {cert.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-2">{cert.issuer}</p>
                  
                  {cert.issue_date && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Calendar className="w-4 h-4" />
                      {new Date(cert.issue_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                      })}
                    </div>
                  )}
                  
                  {cert.verification_link && (
                    <div className="mt-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="w-full group-hover:border-primary/50"
                      >
                        <a
                          href={cert.verification_link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Verify Certificate
                        </a>
                      </Button>
                    </div>
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

export default CertificatesSection;
