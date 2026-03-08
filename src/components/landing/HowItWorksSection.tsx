import { motion } from "framer-motion";
import { UserPlus, Search, CalendarCheck, Star } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Create Your Profile",
    description: "Tell us about your family, special needs, and preferences. It takes just 2 minutes.",
  },
  {
    icon: Search,
    step: "02",
    title: "Browse Caregivers",
    description: "Search and filter verified caregivers based on your specific care needs and preferences.",
  },
  {
    icon: CalendarCheck,
    step: "03",
    title: "Book & Track",
    description: "Schedule sessions, track check-ins live, and communicate securely in-app.",
  },
  {
    icon: Star,
    step: "04",
    title: "Review & Rebook",
    description: "Rate your experience, earn loyalty rewards, and build lasting care relationships.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-secondary tracking-wide uppercase">How It Works</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
            Care in 4 Simple Steps
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            From signup to your first booking in under 10 minutes.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center relative"
            >
              <div className="w-16 h-16 rounded-2xl gradient-primary mx-auto mb-5 flex items-center justify-center shadow-lg">
                <step.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <span className="text-xs font-bold text-primary/40 tracking-widest uppercase">Step {step.step}</span>
              <h3 className="font-display text-lg font-semibold text-foreground mt-1 mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-px bg-border" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
