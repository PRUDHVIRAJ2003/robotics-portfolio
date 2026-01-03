import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { Trophy, Award, Users, Star, Medal, Target, Zap, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Trophy,
  Award,
  Users,
  Star,
  Medal,
  Target,
  Zap,
};

interface Achievement {
  id: string;
  title: string;
  description: string | null;
  link: string | null;
  icon_type: string;
}

const AchievementsSection = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .eq("is_published", true)
        .order("display_order", { ascending: true });

      if (!error && data) {
        setAchievements(data);
      }
      setLoading(false);
    };

    fetchAchievements();
  }, []);

  if (loading) {
    return (
      <section id="achievements" className="py-20 bg-card relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (achievements.length === 0) {
    return null;
  }

  return (
    <section id="achievements" className="py-20 bg-card relative overflow-hidden">
      <div className="absolute inset-0 tech-grid opacity-30" />
      
      <div className="container mx-auto px-4 relative">
        <AnimateOnScroll animation="fade-up">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-gradient-primary">Achievements</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Recognition and milestones in my journey
            </p>
          </div>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => {
            const IconComponent = iconMap[achievement.icon_type] || Trophy;
            return (
              <AnimateOnScroll key={achievement.id} animation="fade-up" delay={index * 100}>
                <div className="bg-background rounded-xl p-6 shadow-card hover:shadow-elevated transition-all duration-300 border border-border hover:border-primary/30 group text-center h-full flex flex-col">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
                    <IconComponent className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                    {achievement.title}
                  </h3>
                  {achievement.description && (
                    <p className="text-muted-foreground text-sm flex-1">{achievement.description}</p>
                  )}
                  {achievement.link && (
                    <div className="mt-4">
                      <Button variant="outline" size="sm" asChild>
                        <a href={achievement.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-3 h-3 mr-2" />
                          View Details
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;
