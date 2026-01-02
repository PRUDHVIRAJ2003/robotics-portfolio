import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Trash2, Mail, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const MessagesManager = () => {
  const [messages, setMessages] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => { fetchMessages(); }, []);

  const fetchMessages = async () => {
    const { data } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false });
    if (data) setMessages(data);
    setLoading(false);
  };

  const toggleRead = async (id: string, isRead: boolean) => {
    await supabase.from("contact_submissions").update({ is_read: !isRead }).eq("id", id);
    fetchMessages();
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    await supabase.from("contact_submissions").delete().eq("id", id);
    toast({ title: "Deleted" });
    fetchMessages();
  };

  if (loading) return <div className="flex justify-center py-8"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Messages ({messages.filter(m => !m.is_read).length} unread)</h2>
      
      <div className="space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`bg-card rounded-lg p-4 border ${msg.is_read ? "border-border" : "border-primary/50 bg-primary/5"}`}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold">{msg.name}</h3>
                <a href={`mailto:${msg.email}`} className="text-sm text-primary hover:underline">{msg.email}</a>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{new Date(msg.created_at).toLocaleDateString()}</span>
                <Button variant="ghost" size="icon" onClick={() => toggleRead(msg.id, msg.is_read)}>{msg.is_read ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</Button>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteMessage(msg.id)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
            <p className="text-muted-foreground whitespace-pre-wrap">{msg.message}</p>
          </div>
        ))}
        {messages.length === 0 && <p className="text-center text-muted-foreground py-8">No messages yet</p>}
      </div>
    </div>
  );
};

export default MessagesManager;
