import { motion } from "framer-motion";
import { Accessibility, HeartHandshake, Briefcase, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const segments = [
  {
    icon: Accessibility,
    label: "Customer A",
    title: "Families with Children with Disabilities",
    color: "bg-coral-light text-primary",
    borderColor: "border-primary/20 hover:border-primary/40",
    propositions: [
      "Specialized caregivers trained for developmental needs",
      "Safe and verified caregivers you can trust",
      "Personalized care plans matched by AI",
    ],
  },
  {
    icon: HeartHandshake,
    label: "Customer B",
    title: "Families with Elderly Individuals",
    color: "bg-teal-light text-secondary",
    borderColor: "border-secondary/20 hover:border-secondary/40",
    propositions: [
      "Reliable caregivers for daily living support",
      "Assistance with mobility, medication reminders, and routines",
      "Licensed nurses and compassionate companions",
    ],
  },
  {
    icon: Briefcase,
    label: "Customer C",
    title: "Busy Working Households",
    color: "bg-accent/15 text-accent-foreground",
    borderColor: "border-accent/20 hover:border-accent/40",
    propositions: [
      "On-demand caregiving support when families need help",
      "Trusted, background-checked caregivers",
      "Flexible scheduling that fits your lifestyle",
    ],
  },
];

const WhoWeServeSection = () => {
  return (
    <section id="who-we-serve" className="py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary tracking-wide uppercase">
            Who We Serve
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
            Safest. Reliable. Cost Effective.
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            CareVerse is built for families who need dependable, verified care — tailored to your unique situation.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {segments.map((seg, index) => (
            <motion.div
              key={seg.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              className={`bg-card rounded-2xl p-8 border ${seg.borderColor} shadow-card transition-all duration-300`}
            >
              <div className={`w-12 h-12 rounded-xl ${seg.color} flex items-center justify-center mb-5`}>
                <seg.icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {seg.label}
              </span>
              <h3 className="font-display text-xl font-semibold text-foreground mt-1 mb-5">
                {seg.title}
              </h3>
              <ul className="space-y-3 mb-6">
                {seg.propositions.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <ArrowRight className="w-4 h-4 text-trust-green mt-0.5 shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <Button variant="hero-outline" size="sm" className="w-full">
                Learn More
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoWeServeSection;
