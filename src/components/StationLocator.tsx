import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Clock, Zap, Star, Search, Filter, Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";

interface Station {
  id: string;
  name: string;
  address: string;
  availableSlots: number;
  totalSlots: number;
  power: string;
  price: string;
  rating: number;
  amenities: string;
  status: string;
}

const StationLocator = () => {
  // Helper to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-success";
      case "offline": return "bg-destructive";
      case "maintenance": return "bg-warning";
      default: return "bg-muted";
    }
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [bookingDetails, setBookingDetails] = useState({ date: "", time: "", duration: "" });
  const [bookingLoading, setBookingLoading] = useState(false);

  // Add these states for booking dialog
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [selectedDuration, setSelectedDuration] = useState<string | undefined>(undefined);

  // Define available time slots for booking
  const timeSlots = [
    "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
    "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
    "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM"
  ];

  // Define available durations for booking
  const durations = [
    "30 minutes", "1 hour", "1.5 hours", "2 hours", "3 hours"
  ];
  
  const [stations, setStations] = useState<Station[]>([]);
  const [loadingStations, setLoadingStations] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/stations')
      .then(res => res.json())
      .then(data => {
        setStations(Array.isArray(data.stations) ? data.stations : []);
        setLoadingStations(false);
      })
      .catch(() => setLoadingStations(false));
  }, []);

  const getAvailabilityColor = (available: number, total: number) => {
    const ratio = available / total;
    if (ratio > 0.5) return "text-success";
    if (ratio > 0.2) return "text-warning";
    return "text-destructive";
  };

  const filteredStations = stations.filter(station => {
    const matchesSearch = station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         station.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filter === "all" || 
                         (filter === "available" && station.availableSlots > 0) ||
                         (filter === "fast" && parseInt(station.power) >= 300);
    
    return matchesSearch && matchesFilter;
  });

  function cn(...classes: (string | false | null | undefined)[]): string {
    return classes.filter(Boolean).join(" ");
  }

  function handleBooking(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    event.preventDefault();
    if (!selectedStation || !selectedDate || !selectedTime || !selectedDuration) {
      alert("Please select date, time, and duration.");
      return;
    }
    setBookingLoading(true);
    let user_id = null;
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      if (user && user.id) user_id = user.id;
    } catch {}
    fetch('http://localhost:5000/api/booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id,
        station_id: selectedStation.id,
        station_name: selectedStation.name,
        date: format(selectedDate, "yyyy-MM-dd"),
        time: selectedTime,
        duration: selectedDuration
      })
    })
      .then(res => {
        setBookingLoading(false);
        if (res.ok) {
          alert('Booking successful!');
          setBookingOpen(false);
          setSelectedDate(undefined);
          setSelectedTime(undefined);
          setSelectedDuration(undefined);
        } else {
          alert('Booking failed. Please try again.');
        }
      })
      .catch(() => {
        setBookingLoading(false);
        alert('Booking failed. Please try again.');
      });
  }

  return (
    <section className="py-20 bg-background" id="find-stations">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Find Charging Stations
            </h2>
            <p className="text-muted-foreground text-lg">
              Locate the nearest charging stations with real-time availability
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by location or station name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  onClick={() => setFilter("all")}
                  size="sm"
                >
                  All
                </Button>
                <Button
                  variant={filter === "available" ? "default" : "outline"}
                  onClick={() => setFilter("available")}
                  size="sm"
                >
                  Available
                </Button>
                <Button
                  variant={filter === "fast" ? "default" : "outline"}
                  onClick={() => setFilter("fast")}
                  size="sm"
                >
                  Fast Charge
                </Button>
              </div>
            </div>
          </div>

          {/* Station Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredStations.map((station) => {
        // Parse amenities as array if string
        let amenitiesArr: string[] = [];
        if (Array.isArray(station.amenities)) amenitiesArr = station.amenities;
        else if (typeof station.amenities === 'string') amenitiesArr = station.amenities.split(',').map(a => a.trim()).filter(Boolean);
        // Distance is not in DB, so show blank or calculate if needed
        return (
          <Card key={station.id} className="bg-card border-border hover:shadow-glow-primary transition-all">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{station.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {station.address}
                  </CardDescription>
                </div>
                <Badge className={`text-white ${getStatusColor(station.status)}`}>
                  {station.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Availability */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Availability</span>
                <span className={`font-semibold ${getAvailabilityColor(station.availableSlots, station.totalSlots)}`}>
                  {station.availableSlots}/{station.totalSlots} slots
                </span>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Navigation className="w-3 h-3 text-muted-foreground" />
                  <span></span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-muted-foreground" />
                  <span>{station.power}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span>{station.price}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-warning fill-warning" />
                  <span>{station.rating}</span>
                </div>
              </div>

              {/* Amenities */}
              <div className="space-y-2">
                <span className="text-xs text-muted-foreground">Amenities</span>
                <div className="flex flex-wrap gap-1">
                  {amenitiesArr.slice(0, 3).map((amenity) => (
                    <Badge key={amenity} variant="secondary" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                  {station.amenities.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{station.amenities.length - 3}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  className="flex-1 bg-gradient-electric text-background hover:shadow-glow-primary transition-all"
                  disabled={station.availableSlots === 0 || station.status !== "online"}
                  onClick={() => {
                    setSelectedStation(station);
                    setBookingOpen(true);
                  }}
                >
                  Book Slot
                </Button>
                <Button size="sm" variant="outline">
                  <Navigation className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
      {/* Booking Dialog */}
      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book Slot at {selectedStation?.name}</DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
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
                      <p>Station: {stations.find(s => s.id === selectedStation.id)?.name}</p>
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
          </form>
        </DialogContent>
      </Dialog>
          </div>

          {filteredStations.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No stations found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or location
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default StationLocator;