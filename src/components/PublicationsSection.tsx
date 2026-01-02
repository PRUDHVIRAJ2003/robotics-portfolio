import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, ExternalLink, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Publication {
  id: string;
  title: string;
  description: string | null;
  authors: string[];
  publication_date: string | null;
  publisher: string | null;
  link: string | null;
}

const PublicationsSection = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublications = async () => {
      const { data, error } = await supabase
        .from("publications")
        .select("*")
        .order("publication_date", { ascending: false });

      if (!error && data) {
        setPublications(data);
      }
      setLoading(false);
    };

    fetchPublications();
  }, []);

  if (loading) {
    return (
      <section id="publications" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="publications" className="py-20 bg-background relative overflow-hidden">
      <div className="absolute inset-0 circuit-pattern opacity-10" />
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gradient-primary">Publications</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Academic research and publications
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {publications.map((pub) => (
            <div
              key={pub.id}
              className="bg-card rounded-xl p-6 shadow-card hover:shadow-elevated transition-all duration-300 border border-border hover:border-primary/30 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0 group-hover:shadow-glow transition-all duration-300">
                  <BookOpen className="w-7 h-7 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {pub.title}
                  </h3>
                  {pub.description && (
                    <p className="text-muted-foreground mb-3">{pub.description}</p>
                  )}
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                    {pub.publisher && (
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {pub.publisher}
                      </span>
                    )}
                    {pub.publication_date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(pub.publication_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                        })}
                      </span>
                    )}
                  </div>
                  {pub.link && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={pub.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                        View Publication
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {publications.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Publications coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PublicationsSection;
