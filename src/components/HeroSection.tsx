import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Clock, Shield } from "lucide-react";
import heroImage from "@/assets/hero-charging.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-20">
        <img 
          src={heroImage} 
          alt="EV Charging Station" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary/10 rounded-full blur-3xl animate-pulse-glow delay-1000"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Charge Your Future with
            <span className="bg-gradient-electric bg-clip-text text-transparent"> EVCharge</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience the fastest, most reliable electric vehicle charging network. 
            Book your slot, track your charge, and power your journey with confidence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-gradient-electric text-background font-medium hover:shadow-glow-primary transition-all group">
              Book Charging Slot
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-background">
              Find Stations
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 border border-border hover:shadow-glow-primary transition-all">
              <Zap className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Ultra Fast</h3>
              <p className="text-muted-foreground">Up to 350kW charging speeds for minimal wait times</p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 border border-border hover:shadow-glow-primary transition-all">
              <Clock className="w-8 h-8 text-secondary mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-foreground mb-2">24/7 Available</h3>
              <p className="text-muted-foreground">Round-the-clock service with real-time availability</p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 border border-border hover:shadow-glow-primary transition-all">
              <Shield className="w-8 h-8 text-accent mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Secure</h3>
              <p className="text-muted-foreground">Advanced security with encrypted payment processing</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;