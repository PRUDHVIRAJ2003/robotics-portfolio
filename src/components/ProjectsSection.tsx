import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github } from "lucide-react";

interface Project {
  id: string;
  title: string;
  short_description: string;
  technologies: string[];
  github_link: string | null;
  live_link: string | null;
  thumbnail: string | null;
  is_featured: boolean;
}

const ProjectsSection = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("is_featured", true)
        .order("display_order", { ascending: true })
        .limit(5);

      if (!error && data) {
        setProjects(data);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <section id="projects" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 bg-background relative overflow-hidden">
      <div className="absolute inset-0 circuit-pattern opacity-10" />
      
      <div className="container mx-auto px-4 relative">
        <AnimateOnScroll animation="fade-up">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-gradient-primary">Featured Projects</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Showcasing my best work in robotics and automation
            </p>
          </div>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {projects.map((project, index) => (
            <AnimateOnScroll key={project.id} animation="fade-up" delay={index * 100}>
              <div className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 border border-border hover:border-primary/30 h-full flex flex-col">
                {/* Thumbnail */}
                <div className="h-48 gradient-hero relative overflow-hidden">
                  {project.thumbnail ? (
                    <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <>
                      <div className="absolute inset-0 circuit-pattern opacity-30" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center shadow-glow">
                          <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                    </>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-1">
                    {project.short_description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies?.slice(0, 3).map((tech, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-mono">
                        {tech}
                      </span>
                    ))}
                    {project.technologies && project.technologies.length > 3 && (
                      <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <Link to={`/projects/${project.id}`}>
                      <Button variant="default" size="sm">
                        View Details
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                    {project.github_link && (
                      <a href={project.github_link} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                          <Github className="w-4 h-4" />
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        <AnimateOnScroll animation="fade-up" delay={300}>
          <div className="text-center">
            <Link to="/projects">
              <Button variant="hero" size="lg">
                View All Projects
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default ProjectsSection;
