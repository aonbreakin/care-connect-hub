import { motion } from "framer-motion";
import { Baby, Stethoscope, GraduationCap, Heart, Home, Sparkles } from "lucide-react";

import { motion } from "framer-motion";
import { Sparkles, Heart } from "lucide-react";

const services = [
  {
    icon: Sparkles,
    title: "Special-Needs Training",
    description: "Certified specialists for autism, ADHD, developmental therapy, and behavioral support.",
    price: "From ฿2,000/session",
    color: "bg-coral-light text-primary",
  },
  {
    icon: Heart,
    title: "Elderly Care",
    description: "Compassionate companions for daily activities, medication reminders, and mobility support.",
    price: "From ฿1,200/session",
    color: "bg-teal-light text-secondary",
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary tracking-wide uppercase">Our Services</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
            All Your Home Care Needs, One Platform
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From childcare to elder support, every caregiver is verified, AI-matched, and backed by our CareTrust™ safety system.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="service-card group"
            >
              <div className={`w-12 h-12 rounded-xl ${service.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                <service.icon className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">{service.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{service.description}</p>
              <p className="text-sm font-semibold text-primary">{service.price}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
