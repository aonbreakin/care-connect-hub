import { useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Star, Shield, MapPin, BadgeCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const allCaregivers = [
  { name: "Siriwan P.", role: "Babysitter & Tutor", rating: 4.9, reviews: 127, trustScore: 96, location: "Sukhumvit", specialties: ["Infant Care", "English Tutor", "CPR"], price: 1000, service: "Babysitting", avatar: "SP" },
  { name: "Nanthida K.", role: "Special-Needs Trainer", rating: 5.0, reviews: 84, trustScore: 99, location: "Silom", specialties: ["Autism", "Behavioral Therapy", "15yr Exp"], price: 2000, service: "Special-Needs Training", avatar: "NK" },
  { name: "Pimchanok R.", role: "Home Nurse", rating: 4.8, reviews: 203, trustScore: 94, location: "Thonglor", specialties: ["Elderly Care", "Post-Surgery", "RN"], price: 1500, service: "Nursing", avatar: "PR" },
  { name: "Kannika S.", role: "Housekeeper", rating: 4.7, reviews: 312, trustScore: 91, location: "Ari", specialties: ["Deep Cleaning", "Laundry", "Organizing"], price: 600, service: "Housekeeping", avatar: "KS" },
  { name: "Wanida T.", role: "Math Tutor", rating: 4.9, reviews: 156, trustScore: 95, location: "Sathorn", specialties: ["K-12 Math", "SAT Prep", "Thai/English"], price: 800, service: "Tutoring", avatar: "WT" },
  { name: "Jintara M.", role: "Elderly Caregiver", rating: 4.8, reviews: 98, trustScore: 93, location: "Ekkamai", specialties: ["Mobility Support", "Medication", "Companion"], price: 1200, service: "Elderly Care", avatar: "JM" },
  { name: "Rattana W.", role: "Babysitter", rating: 4.6, reviews: 67, trustScore: 88, location: "On Nut", specialties: ["Toddler Care", "Meal Prep", "Activities"], price: 900, service: "Babysitting", avatar: "RW" },
  { name: "Supaporn L.", role: "Home Nurse", rating: 4.9, reviews: 178, trustScore: 97, location: "Phrom Phong", specialties: ["IV Therapy", "Wound Care", "Licensed RN"], price: 1800, service: "Nursing", avatar: "SL" },
];

const serviceFilters = ["All", "Babysitting", "Nursing", "Special-Needs Training", "Tutoring", "Elderly Care", "Housekeeping"];

const BrowseCaregivers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeService, setActiveService] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = allCaregivers.filter((cg) => {
    const matchesSearch = cg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cg.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cg.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesService = activeService === "All" || cg.service === activeService;
    return matchesSearch && matchesService;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Find Your Perfect Caregiver</h1>
            <p className="text-muted-foreground">AI-matched, verified professionals ready to support your family.</p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by name, skill, or service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 rounded-xl bg-card border-border"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>
            <Button
              variant="outline"
              className="h-12 rounded-xl gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </Button>
          </div>

          {/* Service Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {serviceFilters.map((s) => (
              <button
                key={s}
                onClick={() => setActiveService(s)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeService === s
                    ? "gradient-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Results */}
          <p className="text-sm text-muted-foreground mb-4">{filtered.length} caregivers found</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((cg, index) => (
              <motion.div
                key={cg.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-card rounded-2xl p-5 border border-border shadow-card hover:shadow-card-hover transition-all duration-300"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold shrink-0">
                    {cg.avatar}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <h3 className="font-semibold text-foreground text-sm">{cg.name}</h3>
                      <BadgeCheck className="w-3.5 h-3.5 text-trust-green shrink-0" />
                    </div>
                    <p className="text-xs text-muted-foreground">{cg.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-3 text-xs">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-trust-gold fill-current" />
                    <span className="font-semibold text-foreground">{cg.rating}</span>
                    <span className="text-muted-foreground">({cg.reviews})</span>
                  </div>
                  <div className="trust-badge">
                    <Shield className="w-3 h-3" />
                    {cg.trustScore}%
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                  <MapPin className="w-3 h-3" />
                  {cg.location}, Bangkok
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {cg.specialties.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded-full bg-muted text-[11px] text-muted-foreground font-medium">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="font-semibold text-foreground text-sm">฿{cg.price.toLocaleString()}</span>
                  <Button variant="hero" size="sm" className="text-xs h-8">Book Now</Button>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No caregivers match your filters. Try adjusting your search.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BrowseCaregivers;
