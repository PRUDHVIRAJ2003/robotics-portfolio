import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ImageUpload from "@/components/admin/ImageUpload";
import { Plus, Pencil, Trash2, Award, ExternalLink } from "lucide-react";

interface Certification {
  id: string;
  title: string;
  issuer: string;
  issue_date: string | null;
  image: string | null;
  verification_link: string | null;
  display_order: number;
  is_published: boolean;
}

const CertificationsManager = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Certification | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    issuer: "",
    issue_date: "",
    image: "",
    verification_link: "",
    display_order: 0,
    is_published: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    const { data, error } = await supabase
      .from("certifications")
      .select("*")
      .order("display_order", { ascending: true });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setCertifications(data || []);
    }
    setLoading(false);
  };

  const openCreateDialog = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      issuer: "",
      issue_date: "",
      image: "",
      verification_link: "",
      display_order: certifications.length,
      is_published: true,
    });
    setDialogOpen(true);
  };

  const openEditDialog = (item: Certification) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      issuer: item.issuer,
      issue_date: item.issue_date || "",
      image: item.image || "",
      verification_link: item.verification_link || "",
      display_order: item.display_order,
      is_published: item.is_published,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const payload = {
      title: formData.title,
      issuer: formData.issuer,
      issue_date: formData.issue_date || null,
      image: formData.image || null,
      verification_link: formData.verification_link || null,
      display_order: formData.display_order,
      is_published: formData.is_published,
    };

    if (editingItem) {
      const { error } = await supabase.from("certifications").update(payload).eq("id", editingItem.id);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: "Success", description: "Certification updated" });
    } else {
      const { error } = await supabase.from("certifications").insert(payload);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: "Success", description: "Certification added" });
    }

    setDialogOpen(false);
    fetchCertifications();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certification?")) return;
    const { error } = await supabase.from("certifications").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Success", description: "Certification deleted" });
    fetchCertifications();
  };

  if (loading) {
    return <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Certifications</h2>
          <p className="text-muted-foreground">Manage your certifications and credentials</p>
        </div>
        <Button onClick={openCreateDialog}><Plus className="w-4 h-4 mr-2" />Add Certification</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {certifications.map((item) => (
          <div key={item.id} className="bg-card rounded-xl border border-border hover:border-primary/30 transition-colors overflow-hidden">
            {item.image ? (
              <img src={item.image} alt={item.title} className="w-full h-40 object-cover" />
            ) : (
              <div className="w-full h-40 bg-muted flex items-center justify-center">
                <Award className="w-12 h-12 text-muted-foreground/50" />
              </div>
            )}
            <div className="p-4">
              <h3 className="font-bold">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.issuer}</p>
              {item.issue_date && <p className="text-primary text-sm">{new Date(item.issue_date).toLocaleDateString()}</p>}
              {item.verification_link && (
                <a href={item.verification_link} target="_blank" rel="noopener noreferrer" className="text-secondary text-sm flex items-center gap-1 mt-2 hover:underline">
                  <ExternalLink className="w-3 h-3" />Verify
                </a>
              )}
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
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Certification" : "Add Certification"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="title">Certificate Title *</Label>
              <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="AWS Solutions Architect" />
            </div>
            <div>
              <Label htmlFor="issuer">Issuer *</Label>
              <Input id="issuer" value={formData.issuer} onChange={(e) => setFormData({ ...formData, issuer: e.target.value })} placeholder="Amazon Web Services" />
            </div>
            <div>
              <Label htmlFor="issue_date">Issue Date</Label>
              <Input id="issue_date" type="date" value={formData.issue_date} onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })} />
            </div>
            <div>
              <Label>Certificate Image</Label>
              <ImageUpload currentImage={formData.image} onUpload={(url) => setFormData({ ...formData, image: url })} />
            </div>
            <div>
              <Label htmlFor="verification_link">Verification Link</Label>
              <Input id="verification_link" value={formData.verification_link} onChange={(e) => setFormData({ ...formData, verification_link: e.target.value })} placeholder="https://..." />
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

export default CertificationsManager;
