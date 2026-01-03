import { useState } from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin, Mail, Heart, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    setIsSubscribing(true);
    // Simulate subscription
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success("Thank you for subscribing!");
    setEmail("");
    setIsSubscribing(false);
  };

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="text-center sm:text-left">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center shadow-glow">
                <span className="text-primary-foreground font-bold text-lg">PR</span>
              </div>
              <span className="font-bold text-lg">Prudhvi Raj</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto sm:mx-0">
              Robotics & Automation Engineer passionate about building autonomous systems
              and pushing the boundaries of technology.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/projects"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Projects
                </Link>
              </li>
              <li>
                <a
                  href="/#contact"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div className="text-center sm:text-left sm:col-span-2 lg:col-span-1">
            <h4 className="font-bold mb-4">Stay Updated</h4>
            <p className="text-muted-foreground text-sm mb-4">
              Subscribe to get updates on my latest projects and publications.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2 mb-6 max-w-sm mx-auto sm:mx-0">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={isSubscribing}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
            
            <h4 className="font-bold mb-3">Connect</h4>
            <div className="flex gap-3 justify-center sm:justify-start">
              <a
                href="https://linkedin.com/in/prudhvirajchalapaka"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/prudhvirajchalapaka"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="mailto:me@prudhvirajchalapaka.in"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-xs sm:text-sm flex items-center justify-center gap-1 flex-wrap">
            © {currentYear} Prudhvi Raj Chalapaka. Made with
            <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-destructive fill-destructive" />
            Passion
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;