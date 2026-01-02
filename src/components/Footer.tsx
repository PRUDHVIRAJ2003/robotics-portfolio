import { Link } from "react-router-dom";
import { Github, Linkedin, Mail, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center shadow-glow">
                <span className="text-primary-foreground font-bold text-lg">PR</span>
              </div>
              <span className="font-bold text-lg">Prudhvi Raj</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              Robotics & Automation Engineer passionate about building autonomous systems
              and pushing the boundaries of technology.
            </p>
          </div>

          {/* Quick Links */}
          <div>
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
              <li>
                <Link
                  to="/admin"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-bold mb-4">Connect</h4>
            <div className="flex gap-3 mb-4">
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
            <p className="text-muted-foreground text-sm">me@prudhvirajchalapaka.in</p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm flex items-center justify-center gap-1">
            © {currentYear} Prudhvi Raj Chalapaka. Made with
            <Heart className="w-4 h-4 text-destructive fill-destructive" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
