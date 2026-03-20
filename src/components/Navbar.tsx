import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import GoogleTranslate from "@/components/GoogleTranslate";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Carethia logo" className="w-9 h-9 rounded-xl" />
          <span className="font-display text-xl font-bold text-foreground">Carethia</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <Link to="/browse" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Find Caregivers</Link>
          <a href="#services" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Services</a>
          <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
          <a href="#trust" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Trust & Safety</a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <GoogleTranslate />
          {user ? (
            <>
             <Link to="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                {user.user_metadata?.full_name || "Dashboard"}
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-1" /> Log Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>Log In</Button>
              <Button variant="hero" size="sm" onClick={() => navigate("/auth")}>Sign Up Free</Button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-foreground" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-background border-b border-border px-4 pb-4 space-y-3">
          <Link to="/" className="block py-2 text-sm font-medium text-foreground" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/browse" className="block py-2 text-sm font-medium text-foreground" onClick={() => setIsOpen(false)}>Find Caregivers</Link>
          <a href="#services" className="block py-2 text-sm font-medium text-foreground" onClick={() => setIsOpen(false)}>Services</a>
          <a href="#how-it-works" className="block py-2 text-sm font-medium text-foreground" onClick={() => setIsOpen(false)}>How It Works</a>
          <div className="flex gap-2 pt-2">
            {user ? (
              <>
                <Link to="/dashboard" className="block py-2 text-sm font-medium text-foreground" onClick={() => setIsOpen(false)}>Dashboard</Link>
                <Button variant="ghost" size="sm" className="flex-1" onClick={() => { handleSignOut(); setIsOpen(false); }}>
                  <LogOut className="w-4 h-4 mr-1" /> Log Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="flex-1" onClick={() => { navigate("/auth"); setIsOpen(false); }}>Log In</Button>
                <Button variant="hero" size="sm" className="flex-1" onClick={() => { navigate("/auth"); setIsOpen(false); }}>Sign Up</Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
