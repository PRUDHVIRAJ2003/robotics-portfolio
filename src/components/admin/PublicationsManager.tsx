import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import RichTextEditor from "./RichTextEditor";
import { Plus, Edit, Trash2, Save } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Publication {
  id: string;
  title: string;
  description: string | null;
  authors: string[];
  publication_date: string | null;
  publisher: string | null;
  link: string | null;
  doi: string | null;
  is_published: boolean;
}

const PublicationsManager = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPub, setEditingPub] = useState<Publication | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const emptyPub = { title: "", description: "", authors: [] as string[], publication_date: "", publisher: "", link: "", doi: "", is_published: true };
  const [formData, setFormData] = useState(emptyPub);
  const [authorInput, setAuthorInput] = useState("");

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const { data } = await supabase.from("publications").select("*").order("publication_date", { ascending: false });
    if (data) setPublications(data);
    setLoading(false);
  };

  const openCreate = () => { setEditingPub(null); setFormData(emptyPub); setAuthorInput(""); setIsDialogOpen(true); };

  const openEdit = (pub: Publication) => {
    setEditingPub(pub);
    setFormData({
      title: pub.title,
      description: pub.description || "",
      authors: pub.authors || [],
      publication_date: pub.publication_date || "",
      publisher: pub.publisher || "",
      link: pub.link || "",
      doi: pub.doi || "",
      is_published: pub.is_published,
    });
    setIsDialogOpen(true);
  };

  const addAuthor = () => {
    if (authorInput.trim() && !formData.authors.includes(authorInput.trim())) {
      setFormData({ ...formData, authors: [...formData.authors, authorInput.trim()] });
      setAuthorInput("");
    }
  };

  const handleSave = async () => {
    if (!formData.title) { toast({ title: "Error", description: "Title required", variant: "destructive" }); return; }
    const payload = { ...formData, description: formData.description || null, publication_date: formData.publication_date || null, publisher: formData.publisher || null, link: formData.link || null, doi: formData.doi || null };
    
    if (editingPub) {
      const { error } = await supabase.from("publications").update(payload).eq("id", editingPub.id);
      if (!error) { toast({ title: "Updated" }); setIsDialogOpen(false); fetchData(); }
    } else {
      const { error } = await supabase.from("publications").insert([payload]);
      if (!error) { toast({ title: "Created" }); setIsDialogOpen(false); fetchData(); }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this publication?")) return;
    await supabase.from("publications").delete().eq("id", id);
    toast({ title: "Deleted" });
    fetchData();
  };

  if (loading) return <div className="flex justify-center py-8"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Publications</h2>
        <Button onClick={openCreate}><Plus className="w-4 h-4" />Add Publication</Button>
      </div>

      <div className="grid gap-4">
        {publications.map((pub) => (
          <div key={pub.id} className="bg-card rounded-lg p-4 border border-border flex items-center gap-4">
            <div className="flex-1">
              <h3 className="font-bold">{pub.title}</h3>
              <p className="text-sm text-muted-foreground">{pub.publisher} • {pub.publication_date}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => openEdit(pub)}><Edit className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(pub.id)}><Trash2 className="w-4 h-4" /></Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingPub ? "Edit" : "Add"} Publication</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><label className="text-sm font-medium">Title *</label><Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} /></div>
            <div><label className="text-sm font-medium">Description</label><RichTextEditor content={formData.description} onChange={(c) => setFormData({ ...formData, description: c })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium">Publisher</label><Input value={formData.publisher} onChange={(e) => setFormData({ ...formData, publisher: e.target.value })} /></div>
              <div><label className="text-sm font-medium">Date</label><Input type="date" value={formData.publication_date} onChange={(e) => setFormData({ ...formData, publication_date: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium">Link</label><Input value={formData.link} onChange={(e) => setFormData({ ...formData, link: e.target.value })} /></div>
              <div><label className="text-sm font-medium">DOI</label><Input value={formData.doi} onChange={(e) => setFormData({ ...formData, doi: e.target.value })} /></div>
            </div>
            <div className="flex items-center gap-2"><Switch checked={formData.is_published} onCheckedChange={(c) => setFormData({ ...formData, is_published: c })} /><label>Published</label></div>
            <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button><Button onClick={handleSave}><Save className="w-4 h-4" />Save</Button></div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PublicationsManager;
