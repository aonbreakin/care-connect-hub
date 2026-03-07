import Navbar from "@/components/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import ServicesSection from "@/components/landing/ServicesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import TrustSection from "@/components/landing/TrustSection";
import FeaturedCaregiversSection from "@/components/landing/FeaturedCaregiversSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <HowItWorksSection />
      <TrustSection />
      <FeaturedCaregiversSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
