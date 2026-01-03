import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import ThemeToggle from "@/components/ThemeToggle";
import ProjectsManager from "@/components/admin/ProjectsManager";
import PublicationsManager from "@/components/admin/PublicationsManager";
import MessagesManager from "@/components/admin/MessagesManager";
import SettingsManager from "@/components/admin/SettingsManager";
import ResumeManager from "@/components/admin/ResumeManager";
import SubscribersManager from "@/components/admin/SubscribersManager";
import EducationManager from "@/components/admin/EducationManager";
import ExperiencesManager from "@/components/admin/ExperiencesManager";
import CertificationsManager from "@/components/admin/CertificationsManager";
import AchievementsManager from "@/components/admin/AchievementsManager";
import { Lock, LogOut, FolderOpen, BookOpen, Mail, Settings, Home, LayoutDashboard, FileText, Users, GraduationCap, Briefcase, Award, Trophy } from "lucide-react";

type Tab = "dashboard" | "projects" | "publications" | "messages" | "resume" | "subscribers" | "settings" | "education" | "experiences" | "certifications" | "achievements";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [stats, setStats] = useState({ projects: 0, publications: 0, messages: 0, unread: 0, subscribers: 0, education: 0, experiences: 0, certifications: 0, achievements: 0 });
  const { toast } = useToast();

  useEffect(() => {
    if (sessionStorage.getItem("admin_auth") === "true") {
      setIsAuthenticated(true);
      fetchStats();
    }
  }, []);

  const fetchStats = async () => {
    const [projectsRes, pubsRes, msgsRes, subsRes, eduRes, expRes, certRes, achRes] = await Promise.all([
      supabase.from("projects").select("id", { count: "exact" }),
      supabase.from("publications").select("id", { count: "exact" }),
      supabase.from("contact_submissions").select("id, is_read"),
      supabase.from("newsletter_subscribers").select("id", { count: "exact" }),
      supabase.from("education").select("id", { count: "exact" }),
      supabase.from("experiences").select("id", { count: "exact" }),
      supabase.from("certifications").select("id", { count: "exact" }),
      supabase.from("achievements").select("id", { count: "exact" }),
    ]);
    setStats({
      projects: projectsRes.count || 0,
      publications: pubsRes.count || 0,
      messages: msgsRes.data?.length || 0,
      unread: msgsRes.data?.filter((m) => !m.is_read).length || 0,
      subscribers: subsRes.count || 0,
      education: eduRes.count || 0,
      experiences: expRes.count || 0,
      certifications: certRes.count || 0,
      achievements: achRes.count || 0,
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data } = await supabase.from("admin_settings").select("setting_value").eq("setting_key", "admin_password").maybeSingle();
    if (data?.setting_value === password) {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_auth", "true");
      toast({ title: "Welcome!", description: "Successfully logged in" });
      fetchStats();
    } else {
      toast({ title: "Error", description: "Invalid password", variant: "destructive" });
    }
    setLoading(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    setIsAuthenticated(false);
    setActiveTab("dashboard");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
        <div className="absolute top-4 right-4"><ThemeToggle /></div>
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
          <div className="mt-4 text-center">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary">← Back to website</Link>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: "dashboard" as Tab, label: "Dashboard", icon: LayoutDashboard },
    { id: "education" as Tab, label: "Education", icon: GraduationCap, count: stats.education },
    { id: "experiences" as Tab, label: "Experiences", icon: Briefcase, count: stats.experiences },
    { id: "projects" as Tab, label: "Projects", icon: FolderOpen, count: stats.projects },
    { id: "certifications" as Tab, label: "Certifications", icon: Award, count: stats.certifications },
    { id: "achievements" as Tab, label: "Achievements", icon: Trophy, count: stats.achievements },
    { id: "publications" as Tab, label: "Publications", icon: BookOpen, count: stats.publications },
    { id: "messages" as Tab, label: "Messages", icon: Mail, count: stats.unread },
    { id: "subscribers" as Tab, label: "Subscribers", icon: Users, count: stats.subscribers },
    { id: "resume" as Tab, label: "Resume", icon: FileText },
    { id: "settings" as Tab, label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border p-4 flex flex-col flex-shrink-0">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center shadow-glow">
            <span className="text-primary-foreground font-bold">PR</span>
          </div>
          <div>
            <h1 className="font-bold">Admin Panel</h1>
            <p className="text-xs text-muted-foreground">Portfolio CMS</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeTab === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="flex-1">{item.label}</span>
              {item.count !== undefined && item.count > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === item.id ? "bg-primary-foreground/20" : "bg-primary/10 text-primary"}`}>
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="pt-4 border-t border-border space-y-2">
          <Link to="/" className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-foreground transition-colors">
            <Home className="w-5 h-5" />
            <span>View Website</span>
          </Link>
          <div className="flex items-center justify-between px-3">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold">Welcome back!</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <button onClick={() => setActiveTab("education")} className="bg-card rounded-xl p-6 border border-border hover:border-primary/30 transition-all text-left group">
                <GraduationCap className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-2xl">{stats.education}</h3>
                <p className="text-muted-foreground">Education</p>
              </button>
              <button onClick={() => setActiveTab("experiences")} className="bg-card rounded-xl p-6 border border-border hover:border-secondary/30 transition-all text-left group">
                <Briefcase className="w-10 h-10 text-secondary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-2xl">{stats.experiences}</h3>
                <p className="text-muted-foreground">Experiences</p>
              </button>
              <button onClick={() => setActiveTab("projects")} className="bg-card rounded-xl p-6 border border-border hover:border-primary/30 transition-all text-left group">
                <FolderOpen className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-2xl">{stats.projects}</h3>
                <p className="text-muted-foreground">Projects</p>
              </button>
              <button onClick={() => setActiveTab("certifications")} className="bg-card rounded-xl p-6 border border-border hover:border-accent/30 transition-all text-left group">
                <Award className="w-10 h-10 text-accent mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-2xl">{stats.certifications}</h3>
                <p className="text-muted-foreground">Certifications</p>
              </button>
              <button onClick={() => setActiveTab("achievements")} className="bg-card rounded-xl p-6 border border-border hover:border-primary/30 transition-all text-left group">
                <Trophy className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-2xl">{stats.achievements}</h3>
                <p className="text-muted-foreground">Achievements</p>
              </button>
              <button onClick={() => setActiveTab("publications")} className="bg-card rounded-xl p-6 border border-border hover:border-secondary/30 transition-all text-left group">
                <BookOpen className="w-10 h-10 text-secondary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-2xl">{stats.publications}</h3>
                <p className="text-muted-foreground">Publications</p>
              </button>
              <button onClick={() => setActiveTab("messages")} className="bg-card rounded-xl p-6 border border-border hover:border-accent/30 transition-all text-left group">
                <Mail className="w-10 h-10 text-accent mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-2xl">{stats.messages}</h3>
                <p className="text-muted-foreground">Messages ({stats.unread} unread)</p>
              </button>
              <button onClick={() => setActiveTab("subscribers")} className="bg-card rounded-xl p-6 border border-border hover:border-primary/30 transition-all text-left group">
                <Users className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-2xl">{stats.subscribers}</h3>
                <p className="text-muted-foreground">Subscribers</p>
              </button>
            </div>
          </div>
        )}
        {activeTab === "education" && <EducationManager />}
        {activeTab === "experiences" && <ExperiencesManager />}
        {activeTab === "projects" && <ProjectsManager />}
        {activeTab === "certifications" && <CertificationsManager />}
        {activeTab === "achievements" && <AchievementsManager />}
        {activeTab === "publications" && <PublicationsManager />}
        {activeTab === "messages" && <MessagesManager />}
        {activeTab === "subscribers" && <SubscribersManager />}
        {activeTab === "resume" && <ResumeManager />}
        {activeTab === "settings" && <SettingsManager />}
      </main>
    </div>
  );
};

export default Admin;
