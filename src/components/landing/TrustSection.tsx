import { motion } from "framer-motion";
import { Shield, Fingerprint, Eye, BadgeCheck, Lock, Bell } from "lucide-react";

const features = [
  {
    icon: Fingerprint,
    title: "Background Verified",
    description: "Every caregiver passes government ID verification and third-party criminal background checks.",
  },
  {
    icon: Shield,
    title: "CareTrust™ AI Score",
    description: "Our AI continuously evaluates punctuality, reviews, and behavior to generate real-time trust scores.",
  },
  {
    icon: Eye,
    title: "Live Session Tracking",
    description: "GPS check-in/out, real-time messaging, and optional photo updates during every session.",
  },
  {
    icon: BadgeCheck,
    title: "Certified Professionals",
    description: "Specialized caregivers hold verified certifications in nursing, special-needs therapy, and more.",
  },
  {
    icon: Lock,
    title: "Secure Payments",
    description: "Escrow-protected payments released only after session completion. PCI-compliant processing.",
  },
  {
    icon: Bell,
    title: "Emergency Support",
    description: "One-tap emergency button during sessions. 24/7 support team for urgent situations.",
  },
];

const TrustSection = () => {
  return (
    <section id="trust" className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-trust-green tracking-wide uppercase flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" /> Trust & Safety
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
            Safety You Can Trust
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your family's safety is our #1 priority. Every caregiver goes through our rigorous 6-step verification process.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="bg-card rounded-2xl p-6 border border-border hover:border-trust-green/30 transition-colors shadow-card"
            >
              <div className="w-11 h-11 rounded-xl bg-teal-light flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-secondary" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
