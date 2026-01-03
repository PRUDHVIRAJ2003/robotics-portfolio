import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";
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
import InviteCodesManager from "@/components/admin/InviteCodesManager";
import { Lock, LogOut, FolderOpen, BookOpen, Mail, Settings, Home, LayoutDashboard, FileText, Users, GraduationCap, Briefcase, Award, Trophy, Loader2, ShieldAlert, KeyRound, UserPlus, ArrowLeft } from "lucide-react";
import { z } from "zod";

type Tab = "dashboard" | "projects" | "publications" | "messages" | "resume" | "subscribers" | "settings" | "education" | "experiences" | "certifications" | "achievements" | "invite-codes";
type AuthView = "login" | "signup" | "forgot-password" | "reset-password";

const emailSchema = z.string().trim().email("Invalid email address").max(255, "Email too long");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters").max(72, "Password too long");
const inviteCodeSchema = z.string().trim().min(1, "Invite code is required");

const Admin = () => {
  const { user, isAdmin, loading: authLoading, signIn, signUp, signOut, resetPassword, updatePassword } = useAdminAuth();
  const [authView, setAuthView] = useState<AuthView>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [stats, setStats] = useState({ projects: 0, publications: 0, messages: 0, unread: 0, subscribers: 0, education: 0, experiences: 0, certifications: 0, achievements: 0 });
  const { toast } = useToast();

  // Check if we're in password reset mode (from email link)
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    if (hashParams.get("type") === "recovery") {
      setAuthView("reset-password");
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin]);

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
    
    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast({ title: "Validation Error", description: err.errors[0].message, variant: "destructive" });
        return;
      }
    }

    setFormLoading(true);
    const { error } = await signIn(email, password);
    
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Welcome!", description: "Successfully logged in" });
    }
    setFormLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);
      inviteCodeSchema.parse(inviteCode);
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast({ title: "Validation Error", description: err.errors[0].message, variant: "destructive" });
        return;
      }
    }

    if (password !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }

    setFormLoading(true);
    const { error } = await signUp(email, password, inviteCode);
    
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success!", description: "Admin account created successfully" });
      setAuthView("login");
    }
    setFormLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      emailSchema.parse(email);
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast({ title: "Validation Error", description: err.errors[0].message, variant: "destructive" });
        return;
      }
    }

    setFormLoading(true);
    const { error } = await resetPassword(email);
    
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Email Sent", description: "Check your email for password reset instructions" });
      setAuthView("login");
    }
    setFormLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      passwordSchema.parse(password);
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast({ title: "Validation Error", description: err.errors[0].message, variant: "destructive" });
        return;
      }
    }

    if (password !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }

    setFormLoading(true);
    const { error } = await updatePassword(password);
    
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success!", description: "Password updated successfully" });
      window.location.hash = "";
      setAuthView("login");
    }
    setFormLoading(false);
  };

  const handleLogout = async () => {
    await signOut();
    setActiveTab("dashboard");
    toast({ title: "Logged out", description: "You have been logged out" });
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setInviteCode("");
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Not logged in - show auth forms
  if (!user || authView === "reset-password") {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
        <div className="absolute top-4 right-4"><ThemeToggle /></div>
        <div className="bg-card rounded-xl p-8 shadow-elevated border border-border max-w-md w-full">
          {/* Login View */}
          {authView === "login" && (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto rounded-full gradient-primary flex items-center justify-center shadow-glow mb-4">
                  <Lock className="w-8 h-8 text-primary-foreground" />
                </div>
                <h1 className="text-2xl font-bold">Admin Panel</h1>
                <p className="text-muted-foreground text-sm">Sign in to manage your portfolio</p>
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    type="email" 
                    placeholder="admin@example.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password"
                    type="password" 
                    placeholder="••••••••" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                </div>
                <Button type="submit" variant="hero" className="w-full" disabled={formLoading}>
                  {formLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
              <div className="mt-4 flex flex-col gap-2 text-center">
                <button 
                  onClick={() => { resetForm(); setAuthView("forgot-password"); }}
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Forgot password?
                </button>
                <button 
                  onClick={() => { resetForm(); setAuthView("signup"); }}
                  className="text-sm text-primary hover:underline flex items-center justify-center gap-1"
                >
                  <UserPlus className="w-4 h-4" />
                  Register with invite code
                </button>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary">← Back to website</Link>
              </div>
            </>
          )}

          {/* Signup View */}
          {authView === "signup" && (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto rounded-full gradient-primary flex items-center justify-center shadow-glow mb-4">
                  <UserPlus className="w-8 h-8 text-primary-foreground" />
                </div>
                <h1 className="text-2xl font-bold">Create Admin Account</h1>
                <p className="text-muted-foreground text-sm">Enter your invite code to register</p>
              </div>
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="invite-code">Invite Code</Label>
                  <Input 
                    id="invite-code"
                    type="text" 
                    placeholder="XXXX-XXXX-XXXX" 
                    value={inviteCode} 
                    onChange={(e) => setInviteCode(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input 
                    id="signup-email"
                    type="email" 
                    placeholder="admin@example.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input 
                    id="signup-password"
                    type="password" 
                    placeholder="••••••••" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input 
                    id="confirm-password"
                    type="password" 
                    placeholder="••••••••" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
                <Button type="submit" variant="hero" className="w-full" disabled={formLoading}>
                  {formLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
              <div className="mt-4 text-center">
                <button 
                  onClick={() => { resetForm(); setAuthView("login"); }}
                  className="text-sm text-muted-foreground hover:text-primary flex items-center justify-center gap-1 mx-auto"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to login
                </button>
              </div>
            </>
          )}

          {/* Forgot Password View */}
          {authView === "forgot-password" && (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto rounded-full gradient-primary flex items-center justify-center shadow-glow mb-4">
                  <KeyRound className="w-8 h-8 text-primary-foreground" />
                </div>
                <h1 className="text-2xl font-bold">Reset Password</h1>
                <p className="text-muted-foreground text-sm">Enter your email to receive reset instructions</p>
              </div>
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email</Label>
                  <Input 
                    id="reset-email"
                    type="email" 
                    placeholder="admin@example.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
                <Button type="submit" variant="hero" className="w-full" disabled={formLoading}>
                  {formLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </form>
              <div className="mt-4 text-center">
                <button 
                  onClick={() => { resetForm(); setAuthView("login"); }}
                  className="text-sm text-muted-foreground hover:text-primary flex items-center justify-center gap-1 mx-auto"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to login
                </button>
              </div>
            </>
          )}

          {/* Reset Password View (after clicking email link) */}
          {authView === "reset-password" && (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto rounded-full gradient-primary flex items-center justify-center shadow-glow mb-4">
                  <KeyRound className="w-8 h-8 text-primary-foreground" />
                </div>
                <h1 className="text-2xl font-bold">Set New Password</h1>
                <p className="text-muted-foreground text-sm">Enter your new password</p>
              </div>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input 
                    id="new-password"
                    type="password" 
                    placeholder="••••••••" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-new-password">Confirm New Password</Label>
                  <Input 
                    id="confirm-new-password"
                    type="password" 
                    placeholder="••••••••" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
                <Button type="submit" variant="hero" className="w-full" disabled={formLoading}>
                  {formLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    );
  }

  // Logged in but not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
        <div className="absolute top-4 right-4"><ThemeToggle /></div>
        <div className="bg-card rounded-xl p-8 shadow-elevated border border-border max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <ShieldAlert className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You don't have admin privileges. Please contact the administrator if you believe this is an error.
          </p>
          <div className="space-y-2">
            <Button variant="outline" className="w-full" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
            <Link to="/" className="block">
              <Button variant="ghost" className="w-full">
                <Home className="w-4 h-4 mr-2" />
                Back to Website
              </Button>
            </Link>
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
    { id: "invite-codes" as Tab, label: "Invite Codes", icon: KeyRound },
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
            <p className="text-xs text-muted-foreground truncate max-w-[140px]">{user.email}</p>
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
        {activeTab === "invite-codes" && <InviteCodesManager />}
        {activeTab === "settings" && <SettingsManager />}
      </main>
    </div>
  );
};

export default Admin;
