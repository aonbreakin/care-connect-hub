import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Heart className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display text-lg font-bold text-background">Carethia</span>
            </div>
            <p className="text-sm text-background/50 leading-relaxed">
              AI-powered home support platform connecting families with verified caregivers in Bangkok.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-background mb-4 text-sm">Services</h4>
            <ul className="space-y-2 text-sm text-background/50">
              <li><a href="#" className="hover:text-background/80 transition-colors">Babysitting</a></li>
              <li><a href="#" className="hover:text-background/80 transition-colors">Home Nursing</a></li>
              <li><a href="#" className="hover:text-background/80 transition-colors">Special-Needs Training</a></li>
              <li><a href="#" className="hover:text-background/80 transition-colors">Tutoring</a></li>
              <li><a href="#" className="hover:text-background/80 transition-colors">Elderly Care</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-background mb-4 text-sm">Company</h4>
            <ul className="space-y-2 text-sm text-background/50">
              <li><a href="#" className="hover:text-background/80 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-background/80 transition-colors">For Caregivers</a></li>
              <li><a href="#" className="hover:text-background/80 transition-colors">For Businesses</a></li>
              <li><a href="#" className="hover:text-background/80 transition-colors">Trust & Safety</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-background mb-4 text-sm">Support</h4>
            <ul className="space-y-2 text-sm text-background/50">
              <li><a href="#" className="hover:text-background/80 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-background/80 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-background/80 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-background/80 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 pt-6 text-center text-xs text-background/40">
          © 2026 Carethia. All rights reserved. Made with ❤️ in Bangkok.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
