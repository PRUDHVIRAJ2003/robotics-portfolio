import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import RichTextEditor from "./RichTextEditor";
import ImageUpload from "./ImageUpload";
import { Plus, Edit, Trash2, Save, X, Sparkles, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Project {
  id: string;
  title: string;
  short_description: string;
  full_description: string | null;
  technologies: string[];
  github_link: string | null;
  live_link: string | null;
  thumbnail: string | null;
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
}

const ProjectsManager = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [generatingThumbnails, setGeneratingThumbnails] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const emptyProject: Omit<Project, "id"> = {
    title: "",
    short_description: "",
    full_description: "",
    technologies: [],
    github_link: "",
    live_link: "",
    thumbnail: "",
    is_featured: false,
    is_published: true,
    display_order: 0,
  };

  const [formData, setFormData] = useState<Omit<Project, "id">>(emptyProject);
  const [techInput, setTechInput] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data } = await supabase.from("projects").select("*").order("display_order");
    if (data) setProjects(data);
    setLoading(false);
  };

  const openCreateDialog = () => {
    setEditingProject(null);
    setFormData(emptyProject);
    setTechInput("");
    setIsDialogOpen(true);
  };

  const openEditDialog = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      short_description: project.short_description,
      full_description: project.full_description || "",
      technologies: project.technologies || [],
      github_link: project.github_link || "",
      live_link: project.live_link || "",
      thumbnail: project.thumbnail || "",
      is_featured: project.is_featured,
      is_published: project.is_published,
      display_order: project.display_order,
    });
    setTechInput("");
    setIsDialogOpen(true);
  };

  const addTech = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData({ ...formData, technologies: [...formData.technologies, techInput.trim()] });
      setTechInput("");
    }
  };

  const removeTech = (tech: string) => {
    setFormData({ ...formData, technologies: formData.technologies.filter((t) => t !== tech) });
  };

  const generateThumbnail = async (projectId: string, projectTitle: string) => {
    setGeneratingThumbnails((prev) => ({ ...prev, [projectId]: true }));
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-thumbnail`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ projectId, projectTitle }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate thumbnail");
      }

      toast({ title: "Success", description: "Thumbnail generated!" });
      fetchProjects();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate thumbnail",
        variant: "destructive",
      });
    } finally {
      setGeneratingThumbnails((prev) => ({ ...prev, [projectId]: false }));
    }
  };

  const generateAllThumbnails = async () => {
    const projectsWithoutThumbnails = projects.filter((p) => !p.thumbnail);
    
    for (const project of projectsWithoutThumbnails) {
      await generateThumbnail(project.id, project.title);
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.short_description) {
      toast({ title: "Error", description: "Title and description are required", variant: "destructive" });
      return;
    }

    const payload = {
      ...formData,
      github_link: formData.github_link || null,
      live_link: formData.live_link || null,
      thumbnail: formData.thumbnail || null,
      full_description: formData.full_description || null,
    };

    if (editingProject) {
      const { error } = await supabase.from("projects").update(payload).eq("id", editingProject.id);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Project updated" });
        setIsDialogOpen(false);
        fetchProjects();
      }
    } else {
      const { error } = await supabase.from("projects").insert([payload]);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Project created" });
        setIsDialogOpen(false);
        fetchProjects();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Project removed" });
      fetchProjects();
    }
  };

  if (loading) return <div className="flex justify-center py-8"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  const projectsWithoutThumbnails = projects.filter((p) => !p.thumbnail).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h2 className="text-2xl font-bold">Manage Projects</h2>
        <div className="flex gap-2">
          {projectsWithoutThumbnails > 0 && (
            <Button variant="outline" onClick={generateAllThumbnails}>
              <Sparkles className="w-4 h-4" />
              Generate All Thumbnails ({projectsWithoutThumbnails})
            </Button>
          )}
          <Button onClick={openCreateDialog}><Plus className="w-4 h-4" />Add Project</Button>
        </div>
      </div>

      <div className="grid gap-4">
        {projects.map((project) => (
          <div key={project.id} className="bg-card rounded-lg p-4 border border-border flex items-center gap-4">
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
              {project.thumbnail ? (
                <img src={project.thumbnail} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <Sparkles className="w-6 h-6" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold truncate">{project.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">{project.short_description}</p>
              <div className="flex gap-2 mt-2">
                {project.is_featured && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Featured</span>}
                {!project.is_published && <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">Draft</span>}
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              {!project.thumbnail && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => generateThumbnail(project.id, project.title)}
                  disabled={generatingThumbnails[project.id]}
                >
                  {generatingThumbnails[project.id] ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={() => openEditDialog(project)}><Edit className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(project.id)}><Trash2 className="w-4 h-4" /></Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProject ? "Edit Project" : "Create Project"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Thumbnail</label>
              <ImageUpload currentImage={formData.thumbnail || undefined} onUpload={(url) => setFormData({ ...formData, thumbnail: url })} />
            </div>
            <div>
              <label className="text-sm font-medium">Title *</label>
              <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Project title" />
            </div>
            <div>
              <label className="text-sm font-medium">Short Description *</label>
              <Textarea value={formData.short_description} onChange={(e) => setFormData({ ...formData, short_description: e.target.value })} placeholder="Brief description" rows={2} />
            </div>
            <div>
              <label className="text-sm font-medium">Full Description</label>
              <RichTextEditor content={formData.full_description || ""} onChange={(content) => setFormData({ ...formData, full_description: content })} />
            </div>
            <div>
              <label className="text-sm font-medium">Technologies</label>
              <div className="flex gap-2 mb-2">
                <Input value={techInput} onChange={(e) => setTechInput(e.target.value)} placeholder="Add technology" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())} />
                <Button type="button" variant="outline" onClick={addTech}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.technologies.map((tech) => (
                  <span key={tech} className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-sm">
                    {tech}
                    <button onClick={() => removeTech(tech)} className="hover:text-destructive"><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">GitHub Link</label>
                <Input value={formData.github_link || ""} onChange={(e) => setFormData({ ...formData, github_link: e.target.value })} placeholder="https://github.com/..." />
              </div>
              <div>
                <label className="text-sm font-medium">Live Link</label>
                <Input value={formData.live_link || ""} onChange={(e) => setFormData({ ...formData, live_link: e.target.value })} placeholder="https://..." />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Display Order</label>
                <Input type="number" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch checked={formData.is_featured} onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })} />
                <label className="text-sm">Featured</label>
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch checked={formData.is_published} onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })} />
                <label className="text-sm">Published</label>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}><Save className="w-4 h-4" />Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectsManager;
