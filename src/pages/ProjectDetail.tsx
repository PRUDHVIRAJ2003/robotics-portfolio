import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Github, ExternalLink } from "lucide-react";

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      const { data } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
      setProject(data);
      setLoading(false);
    };
    if (id) fetchProject();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (!project) return <div className="min-h-screen flex items-center justify-center"><p>Project not found</p></div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link to="/projects"><Button variant="ghost" className="mb-6"><ArrowLeft className="w-4 h-4" />Back to Projects</Button></Link>
          <div className="bg-card rounded-xl p-8 shadow-card border border-border">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gradient-primary">{project.title}</h1>
            <p className="text-muted-foreground mb-6">{project.full_description || project.short_description}</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {project.technologies?.map((tech: string, idx: number) => (
                <span key={idx} className="px-3 py-1 bg-primary/10 text-primary rounded-full font-mono text-sm">{tech}</span>
              ))}
            </div>
            <div className="flex gap-4">
              {project.github_link && <Button asChild><a href={project.github_link} target="_blank" rel="noopener noreferrer"><Github className="w-4 h-4" />GitHub</a></Button>}
              {project.live_link && <Button variant="outline" asChild><a href={project.live_link} target="_blank" rel="noopener noreferrer"><ExternalLink className="w-4 h-4" />Live Demo</a></Button>}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProjectDetail;
