import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Key, Save } from "lucide-react";

const SettingsManager = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }

    if (newPassword.length < 4) {
      toast({ title: "Error", description: "Password must be at least 4 characters", variant: "destructive" });
      return;
    }

    setLoading(true);

    // Verify current password
    const { data: current } = await supabase
      .from("admin_settings")
      .select("setting_value")
      .eq("setting_key", "admin_password")
      .maybeSingle();

    if (current?.setting_value !== currentPassword) {
      toast({ title: "Error", description: "Current password is incorrect", variant: "destructive" });
      setLoading(false);
      return;
    }

    // Update password
    const { error } = await supabase
      .from("admin_settings")
      .update({ setting_value: newPassword })
      .eq("setting_key", "admin_password");

    if (error) {
      toast({ title: "Error", description: "Failed to update password", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Password updated successfully" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-md">
      <h2 className="text-2xl font-bold">Settings</h2>

      <div className="bg-card rounded-lg p-6 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
            <Key className="w-5 h-5 text-primary-foreground" />
          </div>
          <h3 className="font-bold">Change Password</h3>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Current Password</label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">New Password</label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Confirm New Password</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={loading}>
            <Save className="w-4 h-4" />
            {loading ? "Saving..." : "Update Password"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SettingsManager;
