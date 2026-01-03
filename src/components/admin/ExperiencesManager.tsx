import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Briefcase, X, ExternalLink } from "lucide-react";

interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  responsibilities: string[];
  certificate_link: string | null;
  display_order: number;
  is_published: boolean;
}

const ExperiencesManager = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Experience | null>(null);
  const [newResponsibility, setNewResponsibility] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    period: "",
    responsibilities: [] as string[],
    certificate_link: "",
    display_order: 0,
    is_published: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    const { data, error } = await supabase
      .from("experiences")
      .select("*")
      .order("display_order", { ascending: true });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setExperiences(data || []);
    }
    setLoading(false);
  };

  const openCreateDialog = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      company: "",
      period: "",
      responsibilities: [],
      certificate_link: "",
      display_order: experiences.length,
      is_published: true,
    });
    setNewResponsibility("");
    setDialogOpen(true);
  };

  const openEditDialog = (item: Experience) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      company: item.company,
      period: item.period,
      responsibilities: item.responsibilities || [],
      certificate_link: item.certificate_link || "",
      display_order: item.display_order,
      is_published: item.is_published,
    });
    setNewResponsibility("");
    setDialogOpen(true);
  };

  const addResponsibility = () => {
    if (newResponsibility.trim()) {
      setFormData({ ...formData, responsibilities: [...formData.responsibilities, newResponsibility.trim()] });
      setNewResponsibility("");
    }
  };

  const removeResponsibility = (index: number) => {
    setFormData({ ...formData, responsibilities: formData.responsibilities.filter((_, i) => i !== index) });
  };

  const handleSave = async () => {
    const payload = {
      title: formData.title,
      company: formData.company,
      period: formData.period,
      responsibilities: formData.responsibilities,
      certificate_link: formData.certificate_link || null,
      display_order: formData.display_order,
      is_published: formData.is_published,
    };

    if (editingItem) {
      const { error } = await supabase.from("experiences").update(payload).eq("id", editingItem.id);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: "Success", description: "Experience updated" });
    } else {
      const { error } = await supabase.from("experiences").insert(payload);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: "Success", description: "Experience added" });
    }

    setDialogOpen(false);
    fetchExperiences();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;
    const { error } = await supabase.from("experiences").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Success", description: "Experience deleted" });
    fetchExperiences();
  };

  if (loading) {
    return <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Experiences</h2>
          <p className="text-muted-foreground">Manage your work experiences</p>
        </div>
        <Button onClick={openCreateDialog}><Plus className="w-4 h-4 mr-2" />Add Experience</Button>
      </div>

      <div className="space-y-4">
        {experiences.map((item) => (
          <div key={item.id} className="bg-card rounded-xl p-4 border border-border hover:border-primary/30 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.company}</p>
                  <p className="text-primary text-sm">{item.period}</p>
                  {item.responsibilities?.length > 0 && (
                    <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                      {item.responsibilities.slice(0, 2).map((r, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                          {r}
                        </li>
                      ))}
                      {item.responsibilities.length > 2 && (
                        <li className="text-muted-foreground/70">+{item.responsibilities.length - 2} more</li>
                      )}
                    </ul>
                  )}
                  {item.certificate_link && (
                    <a href={item.certificate_link} target="_blank" rel="noopener noreferrer" className="text-secondary text-sm flex items-center gap-1 mt-2 hover:underline">
                      <ExternalLink className="w-3 h-3" />View Certificate
                    </a>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full ${item.is_published ? "bg-green-500/20 text-green-500" : "bg-muted text-muted-foreground"}`}>
                  {item.is_published ? "Published" : "Draft"}
                </span>
                <Button variant="outline" size="icon" onClick={() => openEditDialog(item)}><Pencil className="w-4 h-4" /></Button>
                <Button variant="outline" size="icon" onClick={() => handleDelete(item.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Experience" : "Add Experience"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="title">Job Title *</Label>
              <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Software Engineer" />
            </div>
            <div>
              <Label htmlFor="company">Company *</Label>
              <Input id="company" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} placeholder="Company Name" />
            </div>
            <div>
              <Label htmlFor="period">Period *</Label>
              <Input id="period" value={formData.period} onChange={(e) => setFormData({ ...formData, period: e.target.value })} placeholder="Jan 2023 - Present" />
            </div>
            <div>
              <Label>Responsibilities</Label>
              <div className="space-y-2">
                {formData.responsibilities.map((r, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="flex-1 text-sm bg-muted px-3 py-2 rounded-md">{r}</span>
                    <Button variant="ghost" size="icon" onClick={() => removeResponsibility(index)}><X className="w-4 h-4" /></Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input value={newResponsibility} onChange={(e) => setNewResponsibility(e.target.value)} placeholder="Add responsibility" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addResponsibility())} />
                  <Button type="button" variant="outline" onClick={addResponsibility}><Plus className="w-4 h-4" /></Button>
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="certificate_link">Certificate Link</Label>
              <Input id="certificate_link" value={formData.certificate_link} onChange={(e) => setFormData({ ...formData, certificate_link: e.target.value })} placeholder="https://..." />
            </div>
            <div>
              <Label htmlFor="display_order">Display Order</Label>
              <Input id="display_order" type="number" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="flex items-center gap-2">
              <Switch id="is_published" checked={formData.is_published} onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })} />
              <Label htmlFor="is_published">Published</Label>
            </div>
            <Button onClick={handleSave} className="w-full">Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExperiencesManager;
