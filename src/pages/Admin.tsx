import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Lock, LogOut, Settings, FolderOpen, BookOpen, Mail } from "lucide-react";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data } = await supabase.from("admin_settings").select("setting_value").eq("setting_key", "admin_password").maybeSingle();
    if (data?.setting_value === password) {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_auth", "true");
      toast({ title: "Welcome!", description: "Successfully logged in" });
    } else {
      toast({ title: "Error", description: "Invalid password", variant: "destructive" });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (sessionStorage.getItem("admin_auth") === "true") setIsAuthenticated(true);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
        <div className="bg-card rounded-xl p-8 shadow-elevated border border-border max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto rounded-full gradient-primary flex items-center justify-center shadow-glow mb-4">
              <Lock className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground text-sm">Enter password to continue</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" variant="hero" className="w-full" disabled={loading}>
              {loading ? "Verifying..." : "Login"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <Button variant="ghost" onClick={handleLogout}><LogOut className="w-4 h-4" />Logout</Button>
        </div>
      </header>
      <main className="container mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card rounded-xl p-6 border border-border hover:border-primary/30 transition-all">
            <FolderOpen className="w-10 h-10 text-primary mb-4" />
            <h3 className="font-bold text-lg mb-2">Projects</h3>
            <p className="text-muted-foreground text-sm mb-4">Manage your portfolio projects</p>
            <Button variant="outline" size="sm">Manage Projects</Button>
          </div>
          <div className="bg-card rounded-xl p-6 border border-border hover:border-primary/30 transition-all">
            <BookOpen className="w-10 h-10 text-secondary mb-4" />
            <h3 className="font-bold text-lg mb-2">Publications</h3>
            <p className="text-muted-foreground text-sm mb-4">Manage your publications</p>
            <Button variant="outline" size="sm">Manage Publications</Button>
          </div>
          <div className="bg-card rounded-xl p-6 border border-border hover:border-primary/30 transition-all">
            <Mail className="w-10 h-10 text-accent mb-4" />
            <h3 className="font-bold text-lg mb-2">Messages</h3>
            <p className="text-muted-foreground text-sm mb-4">View contact submissions</p>
            <Button variant="outline" size="sm">View Messages</Button>
          </div>
        </div>
        <div className="mt-8 bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-6 h-6 text-primary" />
            <h3 className="font-bold text-lg">Settings</h3>
          </div>
          <p className="text-muted-foreground text-sm">Full admin functionality with rich text editors coming soon. Database is ready for all CRUD operations.</p>
        </div>
      </main>
    </div>
  );
};

export default Admin;
