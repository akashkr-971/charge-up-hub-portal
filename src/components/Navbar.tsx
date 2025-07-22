import { Button } from "@/components/ui/button";
import { Zap, User, Settings, MapPin } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-electric rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-background" />
          </div>
          <span className="text-xl font-bold text-foreground">EVCharge</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <a href="#stations" className="text-muted-foreground hover:text-foreground transition-colors">
            Stations
          </a>
          <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </a>
          <a href="#support" className="text-muted-foreground hover:text-foreground transition-colors">
            Support
          </a>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon">
            <MapPin className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="w-4 h-4" />
          </Button>
          <Button className="bg-gradient-electric text-background font-medium hover:shadow-glow-primary transition-all">
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;