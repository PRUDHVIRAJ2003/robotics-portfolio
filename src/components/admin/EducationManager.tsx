import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, GraduationCap, ExternalLink } from "lucide-react";

interface Education {
  id: string;
  degree: string;
  institution: string;
  period: string;
  grade: string | null;
  certificate_link: string | null;
  display_order: number;
  is_published: boolean;
}

const EducationManager = () => {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Education | null>(null);
  const [formData, setFormData] = useState({
    degree: "",
    institution: "",
    period: "",
    grade: "",
    certificate_link: "",
    display_order: 0,
    is_published: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    const { data, error } = await supabase
      .from("education")
      .select("*")
      .order("display_order", { ascending: true });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setEducation(data || []);
    }
    setLoading(false);
  };

  const openCreateDialog = () => {
    setEditingItem(null);
    setFormData({
      degree: "",
      institution: "",
      period: "",
      grade: "",
      certificate_link: "",
      display_order: education.length,
      is_published: true,
    });
    setDialogOpen(true);
  };

  const openEditDialog = (item: Education) => {
    setEditingItem(item);
    setFormData({
      degree: item.degree,
      institution: item.institution,
      period: item.period,
      grade: item.grade || "",
      certificate_link: item.certificate_link || "",
      display_order: item.display_order,
      is_published: item.is_published,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const payload = {
      degree: formData.degree,
      institution: formData.institution,
      period: formData.period,
      grade: formData.grade || null,
      certificate_link: formData.certificate_link || null,
      display_order: formData.display_order,
      is_published: formData.is_published,
    };

    if (editingItem) {
      const { error } = await supabase.from("education").update(payload).eq("id", editingItem.id);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: "Success", description: "Education updated" });
    } else {
      const { error } = await supabase.from("education").insert(payload);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: "Success", description: "Education added" });
    }

    setDialogOpen(false);
    fetchEducation();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this education entry?")) return;
    const { error } = await supabase.from("education").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Success", description: "Education deleted" });
    fetchEducation();
  };

  if (loading) {
    return <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Education</h2>
          <p className="text-muted-foreground">Manage your educational background</p>
        </div>
        <Button onClick={openCreateDialog}><Plus className="w-4 h-4 mr-2" />Add Education</Button>
      </div>

      <div className="space-y-4">
        {education.map((item) => (
          <div key={item.id} className="bg-card rounded-xl p-4 border border-border hover:border-primary/30 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-bold">{item.degree}</h3>
                  <p className="text-muted-foreground text-sm">{item.institution}</p>
                  <p className="text-primary text-sm">{item.period}</p>
                  {item.grade && <p className="text-muted-foreground text-sm">{item.grade}</p>}
                  {item.certificate_link && (
                    <a href={item.certificate_link} target="_blank" rel="noopener noreferrer" className="text-secondary text-sm flex items-center gap-1 mt-1 hover:underline">
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Education" : "Add Education"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="degree">Degree *</Label>
              <Input id="degree" value={formData.degree} onChange={(e) => setFormData({ ...formData, degree: e.target.value })} placeholder="B.Tech in Robotics" />
            </div>
            <div>
              <Label htmlFor="institution">Institution *</Label>
              <Input id="institution" value={formData.institution} onChange={(e) => setFormData({ ...formData, institution: e.target.value })} placeholder="University Name" />
            </div>
            <div>
              <Label htmlFor="period">Period *</Label>
              <Input id="period" value={formData.period} onChange={(e) => setFormData({ ...formData, period: e.target.value })} placeholder="2020 - 2024" />
            </div>
            <div>
              <Label htmlFor="grade">Grade</Label>
              <Input id="grade" value={formData.grade} onChange={(e) => setFormData({ ...formData, grade: e.target.value })} placeholder="CGPA: 9.0/10" />
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

export default EducationManager;
