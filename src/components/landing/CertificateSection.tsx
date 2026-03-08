import { motion } from "framer-motion";
import { Award, Upload, BadgeCheck, ShieldCheck } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Certificate",
    description: "Caregivers upload their professional certificates — nursing licenses, CPR, special-needs training, and more.",
  },
  {
    icon: ShieldCheck,
    title: "Admin Verification",
    description: "Our team reviews and verifies each certificate for authenticity and validity.",
  },
  {
    icon: Award,
    title: "Earn Reward Badge",
    description: "Verified caregivers receive trust badges displayed on their profile, boosting visibility and credibility.",
  },
];

const CertificateSection = () => {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-secondary tracking-wide uppercase flex items-center justify-center gap-2">
            <BadgeCheck className="w-4 h-4" /> Certificates & Rewards
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
            Verified Expertise, Rewarded
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Caregivers can upload professional certificates for admin review. Verified certificates earn trust badges and reward recognition.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-teal-light flex items-center justify-center mx-auto mb-5">
                <step.icon className="w-7 h-7 text-secondary" />
              </div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                Step {index + 1}
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CertificateSection;
