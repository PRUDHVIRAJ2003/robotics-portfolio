import { Briefcase, Calendar } from "lucide-react";

const experienceData = [
  {
    title: "Robotics Engineer Intern",
    company: "Karthikesh Robotics Private Limited",
    period: "05/2025 – 11/2025",
    responsibilities: [
      "Developed Autonomous Mobile Robots",
      "Worked on ROS2 and Visualization tools",
      "Implemented different Path Planning Algorithms for Arms and Mobile robots",
    ],
  },
  {
    title: "Teaching Assistantship Intern",
    company: "Vignan's Foundation for Science Technology & Research University",
    period: "01/2025 – 04/2025",
    responsibilities: [
      "Taught Students about ROS in Practical Sessions",
      "Worked on a Research Project Based on autonomous Robot",
      "Helped Students in the Robot Mechanisms, Kinematical & Dynamical Analysis",
    ],
  },
  {
    title: "ROS Intern",
    company: "Karthikesh Robotics Private Limited",
    period: "01/2025 – 02/2025",
    responsibilities: [
      "Worked with the ROS2 Framework",
      "Learned Docker & GUI for ROS2",
    ],
  },
];

const ExperienceSection = () => {
  return (
    <section id="experience" className="py-20 bg-background relative overflow-hidden">
      <div className="absolute inset-0 circuit-pattern opacity-10" />
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gradient-primary">Experience</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            My professional journey in robotics and automation
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {experienceData.map((exp, index) => (
            <div
              key={index}
              className="relative pl-8 border-l-2 border-primary/30 hover:border-primary transition-colors duration-300"
            >
              {/* Timeline dot */}
              <div className="absolute left-0 top-0 w-4 h-4 -translate-x-1/2 rounded-full bg-primary shadow-glow" />
              
              <div className="bg-card rounded-xl p-6 shadow-card hover:shadow-elevated transition-all duration-300 border border-border hover:border-primary/30 group ml-4">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
                      <Briefcase className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{exp.title}</h3>
                      <p className="text-muted-foreground">{exp.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-primary font-mono text-sm bg-primary/10 px-3 py-1 rounded-full">
                    <Calendar className="w-4 h-4" />
                    {exp.period}
                  </div>
                </div>
                
                <ul className="space-y-2">
                  {exp.responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-secondary mt-2 flex-shrink-0" />
                      {resp}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
