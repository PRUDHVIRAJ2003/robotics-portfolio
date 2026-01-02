import { Trophy, Award, Users, Star } from "lucide-react";

const achievements = [
  {
    title: "Team Head - SPARC",
    description: "Led technical team in robotics competitions",
    icon: Users,
  },
  {
    title: "Vice-President, Robotics Club",
    description: "Founding Member and Vice-President of University Robotics Club",
    icon: Star,
  },
  {
    title: "Outstanding Student Publication Award",
    description: "Recognized for research excellence with Elsevier publication",
    icon: Award,
  },
  {
    title: "First Prize - Project Presentation",
    description: "Srujanankura - A National Level Technical Fest",
    icon: Trophy,
  },
  {
    title: "JASC 2024 - Top 5",
    description: "Janatics India Private Limited Competition",
    icon: Trophy,
  },
];

const AchievementsSection = () => {
  return (
    <section id="achievements" className="py-20 bg-card relative overflow-hidden">
      <div className="absolute inset-0 tech-grid opacity-30" />
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gradient-primary">Achievements</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Recognition and milestones in my journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className="bg-background rounded-xl p-6 shadow-card hover:shadow-elevated transition-all duration-300 border border-border hover:border-primary/30 group text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
                <achievement.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                {achievement.title}
              </h3>
              <p className="text-muted-foreground text-sm">{achievement.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;
