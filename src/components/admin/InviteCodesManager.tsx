import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Copy, Trash2, KeyRound, Check, X } from "lucide-react";
import { format } from "date-fns";

interface InviteCode {
  id: string;
  code: string;
  created_at: string;
  expires_at: string | null;
  is_active: boolean;
  used_by: string | null;
  used_at: string | null;
}

const InviteCodesManager = () => {
  const [codes, setCodes] = useState<InviteCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [expiresInDays, setExpiresInDays] = useState("7");
  const { toast } = useToast();

  useEffect(() => {
    fetchCodes();
  }, []);

  const fetchCodes = async () => {
    const { data, error } = await supabase
      .from("invite_codes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: "Failed to fetch invite codes", variant: "destructive" });
    } else {
      setCodes(data || []);
    }
    setLoading(false);
  };

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const segments = [];
    for (let i = 0; i < 3; i++) {
      let segment = "";
      for (let j = 0; j < 4; j++) {
        segment += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      segments.push(segment);
    }
    return segments.join("-");
  };

  const handleCreate = async () => {
    setCreating(true);
    const code = generateCode();
    const days = parseInt(expiresInDays) || 7;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);

    const { data: userData } = await supabase.auth.getUser();

    const { error } = await supabase.from("invite_codes").insert({
      code,
      created_by: userData.user?.id,
      expires_at: expiresAt.toISOString(),
    });

    if (error) {
      toast({ title: "Error", description: "Failed to create invite code", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Invite code created" });
      fetchCodes();
    }
    setCreating(false);
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: "Copied!", description: "Invite code copied to clipboard" });
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("invite_codes").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: "Failed to delete invite code", variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Invite code removed" });
      setCodes(codes.filter((c) => c.id !== id));
    }
  };

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <KeyRound className="w-6 h-6" />
            Invite Codes
          </h2>
          <p className="text-muted-foreground">Generate invite codes for new admin registrations</p>
        </div>
      </div>

      {/* Create New Code */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-semibold mb-4">Generate New Invite Code</h3>
        <div className="flex items-end gap-4">
          <div className="space-y-2">
            <Label htmlFor="expires">Expires in (days)</Label>
            <Input
              id="expires"
              type="number"
              min="1"
              max="365"
              value={expiresInDays}
              onChange={(e) => setExpiresInDays(e.target.value)}
              className="w-32"
            />
          </div>
          <Button onClick={handleCreate} disabled={creating}>
            <Plus className="w-4 h-4 mr-2" />
            {creating ? "Creating..." : "Generate Code"}
          </Button>
        </div>
      </div>

      {/* Codes List */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium">Code</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-left p-4 font-medium">Created</th>
              <th className="text-left p-4 font-medium">Expires</th>
              <th className="text-right p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {codes.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-muted-foreground">
                  No invite codes yet. Generate one above.
                </td>
              </tr>
            ) : (
              codes.map((code) => {
                const expired = isExpired(code.expires_at);
                const used = !!code.used_by;
                const active = code.is_active && !expired && !used;

                return (
                  <tr key={code.id} className="border-t border-border">
                    <td className="p-4">
                      <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                        {code.code}
                      </code>
                    </td>
                    <td className="p-4">
                      {used ? (
                        <span className="inline-flex items-center gap-1 text-muted-foreground">
                          <Check className="w-4 h-4" /> Used
                        </span>
                      ) : expired ? (
                        <span className="inline-flex items-center gap-1 text-destructive">
                          <X className="w-4 h-4" /> Expired
                        </span>
                      ) : active ? (
                        <span className="inline-flex items-center gap-1 text-green-600">
                          <Check className="w-4 h-4" /> Active
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Inactive</span>
                      )}
                    </td>
                    <td className="p-4 text-muted-foreground text-sm">
                      {format(new Date(code.created_at), "MMM d, yyyy")}
                    </td>
                    <td className="p-4 text-muted-foreground text-sm">
                      {code.expires_at
                        ? format(new Date(code.expires_at), "MMM d, yyyy")
                        : "Never"}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {active && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopy(code.code)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(code.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InviteCodesManager;
