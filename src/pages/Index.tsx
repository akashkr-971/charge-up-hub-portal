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
