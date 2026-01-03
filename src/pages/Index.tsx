import { useState } from "react";
import { Helmet } from "react-helmet-async";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import EducationSection from "@/components/EducationSection";
import ExperienceSection from "@/components/ExperienceSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import CertificatesSection from "@/components/CertificatesSection";
import AchievementsSection from "@/components/AchievementsSection";
import PublicationsSection from "@/components/PublicationsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  // structured data for Google Knowledge Graph
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Prudhvi Raj Chalapaka",
    "url": "https://prudhvirajchalapaka.in",
    "jobTitle": "Robotics & Automation Engineer",
    "sameAs": [
      "https://www.linkedin.com/in/prudhvirajchalapaka",
      "https://github.com/prudhvirajchalapaka"
    ],
    "description": "Robotics Engineer specializing in ROS2, Industrial Automation, and Autonomous Systems."
  };

  return (
    <>
      {/* --- START SEO TAGS --- */}
      <Helmet>
        {/* Primary Meta Tags */}
        <title>Prudhvi Raj Chalapaka | Robotics & Autonomous Systems Engineer</title>
        <meta name="title" content="Prudhvi Raj Chalapaka | Robotics & Autonomous Systems Engineer" />
        <meta name="description" content="Portfolio of Prudhvi Raj Chalapaka, a Robotics Engineer specializing in ROS2, Industrial Automation, and Autonomous Systems. Explore my projects and publications." />
        <meta name="keywords" content="Prudhvi Raj Chalapaka, Robotics Engineer, ROS2, Industrial Automation, Autonomous Systems, Portfolio, Germany, Master's" />
        <link rel="canonical" href="https://prudhvirajchalapaka.in/" />

        {/* Open Graph / Facebook / LinkedIn */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://prudhvirajchalapaka.in/" />
        <meta property="og:title" content="Prudhvi Raj Chalapaka | Robotics & Automation Engineer" />
        <meta property="og:description" content="Explore the portfolio of a Robotics Engineer passionate about building autonomous systems and pushing the boundaries of technology." />
        <meta property="og:image" content="https://prudhvirajchalapaka.in/og-image.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://prudhvirajchalapaka.in/" />
        <meta property="twitter:title" content="Prudhvi Raj Chalapaka | Robotics & Automation Engineer" />
        <meta property="twitter:description" content="Explore the portfolio of a Robotics Engineer passionate about building autonomous systems." />
        <meta property="twitter:image" content="https://prudhvirajchalapaka.in/og-image.png" />

        {/* JSON-LD Schema Script */}
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>
      {/* --- END SEO TAGS --- */}

      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      
      <div className={`${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-500`}>
        <Navbar />
        <main>
          <HeroSection />
          <EducationSection />
          <ExperienceSection />
          <SkillsSection />
          <ProjectsSection />
          <CertificatesSection />
          <AchievementsSection />
          <PublicationsSection />
          <ContactSection />
        </main>
        <Footer />
        <BackToTop />
      </div>
    </>
  );
};

export default Index;
