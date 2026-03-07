import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shield, Star, Clock } from "lucide-react";
import heroImage from "@/assets/hero-illustration.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center gradient-hero overflow-hidden pt-16">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-coral-light text-primary text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              AI-Powered • Verified Caregivers
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Your Family's Care,{" "}
              <span className="text-primary">Simplified</span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
              Connect with verified babysitters, nurses, tutors, and home support professionals. 
              AI-matched to your family's unique needs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button variant="hero" size="lg" className="text-base px-8 py-6">
                Find a Caregiver
              </Button>
              <Button variant="hero-outline" size="lg" className="text-base px-8 py-6">
                Become a Caregiver
              </Button>
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-trust-gold" />
                <span>4.9/5 avg rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-trust-green" />
                <span>100% verified</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-secondary" />
                <span>&lt;2hr match time</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-elevated">
              <img
                src={heroImage}
                alt="Happy family with trusted caregiver in a warm home setting"
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Floating stat card */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 -left-4 bg-card rounded-2xl p-4 shadow-elevated border border-border"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-secondary flex items-center justify-center">
                  <Shield className="w-5 h-5 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">CareTrust™ Score</p>
                  <p className="text-xs text-muted-foreground">AI-verified safety rating</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
