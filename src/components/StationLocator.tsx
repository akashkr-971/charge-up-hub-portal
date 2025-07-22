import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Clock, Zap, Star, Search, Filter } from "lucide-react";

interface Station {
  id: string;
  name: string;
  address: string;
  distance: string;
  availableSlots: number;
  totalSlots: number;
  power: string;
  price: string;
  rating: number;
  amenities: string[];
  status: "online" | "offline" | "maintenance";
}

const StationLocator = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const stations: Station[] = [
    {
      id: "1",
      name: "Downtown Electric Hub",
      address: "123 Main St, Downtown",
      distance: "2.5 km",
      availableSlots: 8,
      totalSlots: 12,
      power: "350 kW",
      price: "$0.35/kWh",
      rating: 4.8,
      amenities: ["WiFi", "Cafe", "Restroom", "Shopping"],
      status: "online"
    },
    {
      id: "2",
      name: "Mall Charging Center",
      address: "456 Shopping Ave",
      distance: "4.1 km",
      availableSlots: 12,
      totalSlots: 16,
      power: "250 kW",
      price: "$0.32/kWh",
      rating: 4.6,
      amenities: ["WiFi", "Restaurant", "Shopping", "Parking"],
      status: "online"
    },
    {
      id: "3",
      name: "Highway Express Charge",
      address: "789 Highway Exit 15",
      distance: "6.8 km",
      availableSlots: 6,
      totalSlots: 8,
      power: "300 kW",
      price: "$0.38/kWh",
      rating: 4.5,
      amenities: ["24/7", "Convenience Store", "Restroom"],
      status: "online"
    },
    {
      id: "4",
      name: "Green Valley Station",
      address: "321 Eco Park Dr",
      distance: "8.2 km",
      availableSlots: 0,
      totalSlots: 10,
      power: "200 kW",
      price: "$0.30/kWh",
      rating: 4.3,
      amenities: ["WiFi", "Park", "Restroom"],
      status: "maintenance"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-success";
      case "offline": return "bg-destructive";
      case "maintenance": return "bg-warning";
      default: return "bg-muted";
    }
  };

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

  return (
    <section className="py-20 bg-background">
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
            {filteredStations.map((station) => (
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
                      <span>{station.distance}</span>
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
                      {station.amenities.slice(0, 3).map((amenity) => (
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
                    >
                      Book Slot
                    </Button>
                    <Button size="sm" variant="outline">
                      <Navigation className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
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