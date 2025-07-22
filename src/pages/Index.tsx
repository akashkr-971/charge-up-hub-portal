import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import VehicleRegistration from "@/components/VehicleRegistration";
import SlotBooking from "@/components/SlotBooking";
import ChargingStatus from "@/components/ChargingStatus";
import FeedbackSystem from "@/components/FeedbackSystem";
import StationLocator from "@/components/StationLocator";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Welcome Section */}
      <section className="py-12 px-4 bg-gradient-subtle">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h2 className="text-3xl font-bold text-foreground mb-4">Welcome to ChargePro</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Your trusted partner for seamless electric vehicle charging. Find stations, book slots, 
            and monitor your charging sessions all in one place.
          </p>
        </div>
      </section>
      
      <HeroSection />
      <VehicleRegistration />
      <SlotBooking />
      <ChargingStatus />
      <StationLocator />
      <FeedbackSystem />
      <Footer />
    </div>
  );
};

export default Index;
