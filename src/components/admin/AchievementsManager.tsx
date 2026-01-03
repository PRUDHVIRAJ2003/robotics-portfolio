import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, Trophy, Award, Users, Star, Medal, Target, Zap, ExternalLink } from "lucide-react";

const iconOptions = [
  { value: "Trophy", icon: Trophy, label: "Trophy" },
  { value: "Award", icon: Award, label: "Award" },
  { value: "Users", icon: Users, label: "Users/Team" },
  { value: "Star", icon: Star, label: "Star" },
  { value: "Medal", icon: Medal, label: "Medal" },
  { value: "Target", icon: Target, label: "Target" },
  { value: "Zap", icon: Zap, label: "Lightning" },
];

const getIconComponent = (iconType: string) => {
  const found = iconOptions.find((i) => i.value === iconType);
  return found ? found.icon : Trophy;
};

interface Achievement {
  id: string;
  title: string;
  description: string | null;
  link: string | null;
  icon_type: string;
  display_order: number;
  is_published: boolean;
}

const AchievementsManager = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Achievement | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
    icon_type: "Trophy",
    display_order: 0,
    is_published: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .order("display_order", { ascending: true });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setAchievements(data || []);
    }
    setLoading(false);
  };

  const openCreateDialog = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      description: "",
      link: "",
      icon_type: "Trophy",
      display_order: achievements.length,
      is_published: true,
    });
    setDialogOpen(true);
  };

  const openEditDialog = (item: Achievement) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || "",
      link: item.link || "",
      icon_type: item.icon_type || "Trophy",
      display_order: item.display_order,
      is_published: item.is_published,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const payload = {
      title: formData.title,
      description: formData.description || null,
      link: formData.link || null,
      icon_type: formData.icon_type,
      display_order: formData.display_order,
      is_published: formData.is_published,
    };

    if (editingItem) {
      const { error } = await supabase.from("achievements").update(payload).eq("id", editingItem.id);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: "Success", description: "Achievement updated" });
    } else {
      const { error } = await supabase.from("achievements").insert(payload);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: "Success", description: "Achievement added" });
    }

    setDialogOpen(false);
    fetchAchievements();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this achievement?")) return;
    const { error } = await supabase.from("achievements").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Success", description: "Achievement deleted" });
    fetchAchievements();
  };

  if (loading) {
    return <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Achievements</h2>
          <p className="text-muted-foreground">Manage your achievements and awards</p>
        </div>
        <Button onClick={openCreateDialog}><Plus className="w-4 h-4 mr-2" />Add Achievement</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((item) => {
          const IconComponent = getIconComponent(item.icon_type);
          return (
            <div key={item.id} className="bg-card rounded-xl p-4 border border-border hover:border-primary/30 transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                  <IconComponent className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold truncate">{item.title}</h3>
                  {item.description && <p className="text-muted-foreground text-sm line-clamp-2">{item.description}</p>}
                  {item.link && (
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-secondary text-sm flex items-center gap-1 mt-1 hover:underline">
                      <ExternalLink className="w-3 h-3" />View Details
                    </a>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <span className={`text-xs px-2 py-1 rounded-full ${item.is_published ? "bg-green-500/20 text-green-500" : "bg-muted text-muted-foreground"}`}>
                  {item.is_published ? "Published" : "Draft"}
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => openEditDialog(item)}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="outline" size="icon" onClick={() => handleDelete(item.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Achievement" : "Add Achievement"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="First Prize - Hackathon" />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Brief description of the achievement" rows={3} />
            </div>
            <div>
              <Label htmlFor="icon_type">Icon</Label>
              <Select value={formData.icon_type} onValueChange={(value) => setFormData({ ...formData, icon_type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <option.icon className="w-4 h-4" />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="link">Link (optional)</Label>
              <Input id="link" value={formData.link} onChange={(e) => setFormData({ ...formData, link: e.target.value })} placeholder="https://..." />
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

export default AchievementsManager;
