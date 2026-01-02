import AnimateOnScroll from "@/components/AnimateOnScroll";
import { GraduationCap, MapPin } from "lucide-react";

const educationData = [
  {
    degree: "B. Tech, Robotics & Automation",
    institution: "Vignan's University, Guntur",
    period: "2021 – 2025",
    grade: "CGPA: 7.62 / 10",
    icon: GraduationCap,
  },
  {
    degree: "Intermediate, MPC",
    institution: "Nri Junior College, Tenali",
    period: "2019 – 2021",
    grade: "Marks: 804 / 1000",
    icon: GraduationCap,
  },
  {
    degree: "SSC",
    institution: "Gretnaltes Public School, Duggirala",
    period: "2018 – 2019",
    grade: "GPA: 9.2 / 10",
    icon: GraduationCap,
  },
];

const EducationSection = () => {
  return (
    <section id="education" className="py-20 bg-card relative overflow-hidden">
      <div className="absolute inset-0 tech-grid opacity-30" />
      
      <div className="container mx-auto px-4 relative">
        <AnimateOnScroll animation="fade-up">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-gradient-primary">Education</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              My academic journey in the field of robotics and automation
            </p>
          </div>
        </AnimateOnScroll>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent" />

            {educationData.map((edu, index) => (
              <AnimateOnScroll
                key={index}
                animation={index % 2 === 0 ? "fade-right" : "fade-left"}
                delay={index * 150}
              >
                <div
                  className={`relative flex items-center gap-8 mb-12 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className="absolute left-8 md:left-1/2 w-4 h-4 -translate-x-1/2 rounded-full bg-primary shadow-glow z-10" />

                  <div
                    className={`ml-16 md:ml-0 md:w-[calc(50%-2rem)] ${
                      index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"
                    }`}
                  >
                    <div className="bg-background rounded-xl p-6 shadow-card hover:shadow-elevated transition-all duration-300 border border-border hover:border-primary/30 group">
                      <div className={`flex items-center gap-3 mb-3 ${index % 2 === 0 ? "md:justify-end" : ""}`}>
                        <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
                          <edu.icon className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="text-primary font-mono text-sm">{edu.period}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{edu.degree}</h3>
                      <p className="text-muted-foreground flex items-center gap-2 mb-2 text-sm">
                        <MapPin className="w-4 h-4" />
                        {edu.institution}
                      </p>
                      <p className="text-primary font-semibold">{edu.grade}</p>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
