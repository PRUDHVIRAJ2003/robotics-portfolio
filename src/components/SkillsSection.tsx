import { Code, Cpu, Wrench, Box, Terminal, Cog } from "lucide-react";

const skillCategories = [
  {
    title: "Programming Languages",
    icon: Code,
    skills: [
      { name: "C", level: 90 },
      { name: "Python", level: 90 },
      { name: "C++", level: 70 },
      { name: "MATLAB", level: 70 },
      { name: "Java", level: 50 },
    ],
  },
  {
    title: "Frameworks & Tools",
    icon: Terminal,
    skills: [
      { name: "ROS/ROS2", level: 95 },
      { name: "YOLO", level: 80 },
      { name: "TensorFlow", level: 75 },
      { name: "NVIDIA Isaac Sim", level: 70 },
      { name: "FPGA", level: 60 },
    ],
  },
  {
    title: "Hardware & Boards",
    icon: Cpu,
    skills: [
      { name: "Arduino", level: 95 },
      { name: "Raspberry Pi", level: 90 },
      { name: "NVIDIA Jetson", level: 85 },
      { name: "STM32", level: 75 },
    ],
  },
  {
    title: "CAD/CAM",
    icon: Box,
    skills: [
      { name: "Solidworks", level: 85 },
      { name: "Fusion 360", level: 90 },
      { name: "Autodesk", level: 80 },
    ],
  },
  {
    title: "Technologies",
    icon: Cog,
    skills: [
      { name: "CNC", level: 80 },
      { name: "3D Printing", level: 95 },
      { name: "PLCs", level: 85 },
      { name: "Web Development", level: 70 },
    ],
  },
  {
    title: "Simulation & Tools",
    icon: Wrench,
    skills: [
      { name: "Gazebo", level: 90 },
      { name: "Webots", level: 85 },
      { name: "Linux", level: 90 },
      { name: "GIT", level: 85 },
      { name: "TIA Portal", level: 75 },
    ],
  },
];

const SkillsSection = () => {
  return (
    <section id="skills" className="py-20 bg-card relative overflow-hidden">
      <div className="absolute inset-0 tech-grid opacity-30" />
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gradient-primary">Skills & Expertise</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Technical skills and tools I work with
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, index) => (
            <div
              key={index}
              className="bg-background rounded-xl p-6 shadow-card hover:shadow-elevated transition-all duration-300 border border-border hover:border-primary/30 group"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
                  <category.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-bold">{category.title}</h3>
              </div>

              <div className="space-y-4">
                {category.skills.map((skill, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{skill.name}</span>
                      <span className="text-xs text-muted-foreground font-mono">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full gradient-primary rounded-full transition-all duration-1000 ease-out"
                        style={{ 
                          width: `${skill.level}%`,
                          boxShadow: skill.level > 80 ? "0 0 10px hsl(var(--primary) / 0.5)" : "none"
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
