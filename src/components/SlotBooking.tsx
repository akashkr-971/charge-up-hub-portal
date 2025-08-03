import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Clock, MapPin, Zap, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Station {
  id: string;
  name: string;
  address: string;
  distance: string;
  availableSlots: number;
  power: string;
  price: string;
}

const SlotBooking = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedStation, setSelectedStation] = useState<string>("");
  const [selectedDuration, setSelectedDuration] = useState<string>("");

  // Example Kerala stations (replace with real data as needed)
  const stations: Station[] = [
    {
      id: "1",
      name: "Kochi EV Hub",
      address: "MG Road, Kochi, Kerala",
      distance: "2.5 km",
      availableSlots: 8,
      power: "350 kW",
      price: "₹18/kWh"
    },
    {
      id: "2",
      name: "Trivandrum Charge Point",
      address: "Technopark, Trivandrum, Kerala",
      distance: "4.1 km",
      availableSlots: 12,
      power: "250 kW",
      price: "₹16/kWh"
    },
    {
      id: "3",
      name: "Calicut Fast Charge",
      address: "Beach Road, Calicut, Kerala",
      distance: "6.8 km",
      availableSlots: 6,
      power: "300 kW",
      price: "₹20/kWh"
    }
  ];

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30"
  ];

  const durations = ["30 min", "1 hour", "1.5 hours", "2 hours", "3 hours"];

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !selectedStation || !selectedDuration) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all booking details.",
        variant: "destructive"
      });
      return;
    }
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    if (!user?.id) {
      toast({
        title: "Not logged in",
        description: "Please log in to book a slot.",
        variant: "destructive",
      });
      return;
    }
    try {
      const station = stations.find(s => s.id === selectedStation);
      const res = await fetch('http://localhost:5000/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          station_id: station?.id,
          station_name: station?.name,
          date: selectedDate.toISOString().split('T')[0],
          time: selectedTime,
          duration: selectedDuration,
        })
      });
      if (res.ok) {
        // toast({
        //   title: "Booking Confirmed!",
        //   description: `Your charging slot has been booked for ${format(selectedDate, "PPP")} at ${selectedTime}.`,
        // });
        window.location.href = '/Payment?userId=' + user.id + '&duration=' + selectedDuration + '&stationId=' + station?.id + '&date=' + selectedDate.toISOString().split('T')[0] + '&time=' + selectedTime;
      } else {
        toast({
          title: "Booking Failed",
          description: "Could not save booking. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "An error occurred while saving booking.",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="py-20 bg-muted/30" id="slot-booking">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Book Your Charging Slot
            </h2>
            <p className="text-muted-foreground text-lg">
              Select your preferred station, date, and time for seamless charging
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Station Selection */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Choose Station
                </CardTitle>
                <CardDescription>
                  Select from available charging stations near you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {stations.map((station) => (
                  <div
                    key={station.id}
                    className={cn(
                      "p-4 rounded-lg border cursor-pointer transition-all hover:shadow-glow-primary",
                      selectedStation === station.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    )}
                    onClick={() => setSelectedStation(station.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-foreground">{station.name}</h3>
                      <Badge variant={station.availableSlots > 5 ? "default" : "secondary"}>
                        {station.availableSlots} available
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">{station.address}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {station.distance}
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        {station.power}
                      </span>
                      <span className="flex items-center gap-1">
                        <CreditCard className="w-3 h-3" />
                        {station.price}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Date & Time Selection */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Select Date & Time
                </CardTitle>
                <CardDescription>
                  Choose your preferred charging schedule
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Date Picker */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Time Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time</label>
                  <Select onValueChange={setSelectedTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Duration Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Duration</label>
                  <Select onValueChange={setSelectedDuration}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {durations.map((duration) => (
                        <SelectItem key={duration} value={duration}>
                          {duration}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Booking Summary */}
                {selectedDate && selectedTime && selectedStation && selectedDuration && (
                  <div className="bg-muted rounded-lg p-4 space-y-2">
                    <h3 className="font-medium text-foreground">Booking Summary</h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Station: {stations.find(s => s.id === selectedStation)?.name}</p>
                      <p>Date: {format(selectedDate, "PPP")}</p>
                      <p>Time: {selectedTime}</p>
                      <p>Duration: {selectedDuration}</p>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleBooking}
                  className="w-full bg-gradient-electric text-background font-medium hover:shadow-glow-primary transition-all"
                >
                  Confirm Booking
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SlotBooking;