import Navbar from "@/components/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import WhoWeServeSection from "@/components/landing/WhoWeServeSection";
import ServicesSection from "@/components/landing/ServicesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import TrustSection from "@/components/landing/TrustSection";
import CertificateSection from "@/components/landing/CertificateSection";
import FeaturedCaregiversSection from "@/components/landing/FeaturedCaregiversSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <WhoWeServeSection />
      <ServicesSection />
      <HowItWorksSection />
      <TrustSection />
      <CertificateSection />
      <FeaturedCaregiversSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
