import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Car, Battery, Zap, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VehicleData {
  make: string;
  model: string;
  year: string;
  batteryCapacity: string;
  chargingType: string;
  plateNumber: string;
}

const VehicleRegistration = () => {
  const { toast } = useToast();
  const [vehicleData, setVehicleData] = useState<VehicleData>({
    make: "",
    model: "",
    year: "",
    batteryCapacity: "",
    chargingType: "",
    plateNumber: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    if (!user?.id) {
      toast({
        title: "Not logged in",
        description: "Please log in to register your vehicle.",
        variant: "destructive",
      });
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/vehicle/${user.id}` , {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicle_number: vehicleData.plateNumber,
          brand: vehicleData.make,
          model: vehicleData.model,
          year: vehicleData.year,
        })
      });
      if (res.ok) {
        toast({
          title: "Vehicle Registered Successfully!",
          description: "Your vehicle details have been saved to your profile.",
        });
      } else {
        toast({
          title: "Registration Failed",
          description: "Could not save vehicle details. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "An error occurred while saving vehicle details.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: keyof VehicleData, value: string) => {
    setVehicleData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Register Your Vehicle
            </h2>
            <p className="text-muted-foreground text-lg">
              Add your EV details for a personalized charging experience
            </p>
          </div>

          <Card className="bg-card border-border shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="w-5 h-5 text-primary" />
                Vehicle Information
              </CardTitle>
              <CardDescription>
                Provide your electric vehicle details to optimize your charging sessions
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="make">Vehicle Make</Label>
                    <Select onValueChange={(value) => handleInputChange("make", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select make" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tesla">Tesla</SelectItem>
                        <SelectItem value="bmw">BMW</SelectItem>
                        <SelectItem value="audi">Audi</SelectItem>
                        <SelectItem value="mercedes">Mercedes-Benz</SelectItem>
                        <SelectItem value="volkswagen">Volkswagen</SelectItem>
                        <SelectItem value="nissan">Nissan</SelectItem>
                        <SelectItem value="hyundai">Hyundai</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input
                      id="model"
                      placeholder="e.g., Model 3, i4, e-tron"
                      value={vehicleData.model}
                      onChange={(e) => handleInputChange("model", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Select onValueChange={(value) => handleInputChange("year", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 10 }, (_, i) => (
                          <SelectItem key={2024 - i} value={(2024 - i).toString()}>
                            {2024 - i}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="plateNumber">License Plate</Label>
                    <Input
                      id="plateNumber"
                      placeholder="e.g., ABC-1234"
                      value={vehicleData.plateNumber}
                      onChange={(e) => handleInputChange("plateNumber", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="batteryCapacity" className="flex items-center gap-2">
                      <Battery className="w-4 h-4" />
                      Battery Capacity (kWh)
                    </Label>
                    <Input
                      id="batteryCapacity"
                      type="number"
                      placeholder="e.g., 75"
                      value={vehicleData.batteryCapacity}
                      onChange={(e) => handleInputChange("batteryCapacity", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="chargingType" className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Charging Port Type
                    </Label>
                    <Select onValueChange={(value) => handleInputChange("chargingType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select port type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ccs">CCS (Combined Charging System)</SelectItem>
                        <SelectItem value="chademo">CHAdeMO</SelectItem>
                        <SelectItem value="tesla">Tesla Supercharger</SelectItem>
                        <SelectItem value="type2">Type 2 (AC)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {vehicleData.make && vehicleData.model && (
                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="font-medium text-foreground mb-2">Vehicle Summary</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{vehicleData.year} {vehicleData.make} {vehicleData.model}</Badge>
                      {vehicleData.batteryCapacity && (
                        <Badge variant="outline">{vehicleData.batteryCapacity} kWh</Badge>
                      )}
                      {vehicleData.chargingType && (
                        <Badge variant="outline">{vehicleData.chargingType.toUpperCase()}</Badge>
                      )}
                    </div>
                  </div>
                )}

                <Button type="submit" className="w-full bg-gradient-electric text-background font-medium hover:shadow-glow-primary transition-all">
                  <Save className="w-4 h-4 mr-2" />
                  Save Vehicle Details
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default VehicleRegistration;