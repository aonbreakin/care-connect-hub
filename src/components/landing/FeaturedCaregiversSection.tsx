import { motion } from "framer-motion";
import { Star, Shield, MapPin, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

const caregivers = [
  {
    name: "Siriwan P.",
    role: "Babysitter & Tutor",
    rating: 4.9,
    reviews: 127,
    trustScore: 96,
    location: "Sukhumvit, Bangkok",
    specialties: ["Infant Care", "English Tutor", "CPR Certified"],
    price: "฿1,000/session",
    avatar: "SP",
  },
  {
    name: "Nanthida K.",
    role: "Special-Needs Trainer",
    rating: 5.0,
    reviews: 84,
    trustScore: 99,
    location: "Silom, Bangkok",
    specialties: ["Autism Specialist", "Behavioral Therapy", "15yr Experience"],
    price: "฿2,000/session",
    avatar: "NK",
  },
  {
    name: "Pimchanok R.",
    role: "Home Nurse",
    rating: 4.8,
    reviews: 203,
    trustScore: 94,
    location: "Thonglor, Bangkok",
    specialties: ["Elderly Care", "Post-Surgery", "Licensed RN"],
    price: "฿1,500/session",
    avatar: "PR",
  },
];

const FeaturedCaregiversSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 lg:py-28 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary tracking-wide uppercase">Top Caregivers</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
            Meet Our Highest-Rated Professionals
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Handpicked caregivers with outstanding CareTrust™ scores and verified expertise.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {caregivers.map((cg, index) => (
            <motion.div
              key={cg.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card rounded-2xl p-6 border border-border shadow-card hover:shadow-card-hover transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg shrink-0">
                  {cg.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-semibold text-foreground">{cg.name}</h3>
                    <BadgeCheck className="w-4 h-4 text-trust-green shrink-0" />
                  </div>
                  <p className="text-sm text-muted-foreground">{cg.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-trust-gold fill-current" />
                  <span className="font-semibold text-foreground">{cg.rating}</span>
                  <span className="text-muted-foreground">({cg.reviews})</span>
                </div>
                <div className="trust-badge">
                  <Shield className="w-3 h-3" />
                  {cg.trustScore}%
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
                <MapPin className="w-3.5 h-3.5" />
                {cg.location}
              </div>

              <div className="flex flex-wrap gap-1.5 mb-5">
                {cg.specialties.map((s) => (
                  <span key={s} className="px-2.5 py-1 rounded-full bg-muted text-xs text-muted-foreground font-medium">
                    {s}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="font-semibold text-foreground">{cg.price}</span>
                <Button variant="hero" size="sm" onClick={() => navigate("/browse")}>Book Now</Button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/browse">
            <Button variant="hero-outline" size="lg" className="px-8">
              View All Caregivers
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCaregiversSection;
