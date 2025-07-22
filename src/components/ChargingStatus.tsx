import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Battery, Clock, Zap, DollarSign, MapPin, Pause, Play, Square } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ChargingSession {
  id: string;
  stationName: string;
  vehiclePlate: string;
  startTime: string;
  estimatedEndTime: string;
  currentCharge: number;
  targetCharge: number;
  chargingSpeed: number;
  cost: number;
  status: "charging" | "paused" | "completed" | "error";
}

const ChargingStatus = () => {
  const { toast } = useToast();
  const [chargingSession, setChargingSession] = useState<ChargingSession>({
    id: "CS001",
    stationName: "Downtown Electric Hub",
    vehiclePlate: "ABC-1234",
    startTime: "14:30",
    estimatedEndTime: "16:15",
    currentCharge: 65,
    targetCharge: 90,
    chargingSpeed: 45.2,
    cost: 12.45,
    status: "charging"
  });

  const [isActive, setIsActive] = useState(true);

  // Simulate charging progress
  useEffect(() => {
    const interval = setInterval(() => {
      if (isActive && chargingSession.status === "charging" && chargingSession.currentCharge < chargingSession.targetCharge) {
        setChargingSession(prev => ({
          ...prev,
          currentCharge: Math.min(prev.currentCharge + 0.5, prev.targetCharge),
          cost: prev.cost + 0.02
        }));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isActive, chargingSession.status, chargingSession.currentCharge, chargingSession.targetCharge]);

  const handlePauseResume = () => {
    if (chargingSession.status === "charging") {
      setChargingSession(prev => ({ ...prev, status: "paused" }));
      setIsActive(false);
      toast({
        title: "Charging Paused",
        description: "Your charging session has been paused.",
      });
    } else if (chargingSession.status === "paused") {
      setChargingSession(prev => ({ ...prev, status: "charging" }));
      setIsActive(true);
      toast({
        title: "Charging Resumed",
        description: "Your charging session has been resumed.",
      });
    }
  };

  const handleStop = () => {
    setChargingSession(prev => ({ ...prev, status: "completed" }));
    setIsActive(false);
    toast({
      title: "Charging Session Ended",
      description: "Your charging session has been completed.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "charging": return "bg-success";
      case "paused": return "bg-warning";
      case "completed": return "bg-primary";
      case "error": return "bg-destructive";
      default: return "bg-muted";
    }
  };

  const getEstimatedTime = () => {
    const remaining = chargingSession.targetCharge - chargingSession.currentCharge;
    const timeRemaining = Math.round((remaining / chargingSession.chargingSpeed) * 60);
    return `${Math.floor(timeRemaining / 60)}h ${timeRemaining % 60}m`;
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Charging Status
            </h2>
            <p className="text-muted-foreground text-lg">
              Monitor your vehicle's charging progress in real-time
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Status Card */}
            <div className="lg:col-span-2">
              <Card className="bg-card border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Battery className="w-5 h-5 text-primary" />
                      Charging Session
                    </CardTitle>
                    <Badge className={cn("text-white", getStatusColor(chargingSession.status))}>
                      {chargingSession.status.charAt(0).toUpperCase() + chargingSession.status.slice(1)}
                    </Badge>
                  </div>
                  <CardDescription>
                    Session ID: {chargingSession.id} • Vehicle: {chargingSession.vehiclePlate}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Battery Progress */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Battery Level</span>
                      <span className="text-2xl font-bold text-primary">{chargingSession.currentCharge}%</span>
                    </div>
                    <Progress 
                      value={chargingSession.currentCharge} 
                      className="h-3"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Target: {chargingSession.targetCharge}%</span>
                      <span>Remaining: {chargingSession.targetCharge - chargingSession.currentCharge}%</span>
                    </div>
                  </div>

                  {/* Charging Animation */}
                  <div className="relative bg-muted/50 rounded-lg p-6 overflow-hidden">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-electric rounded-full flex items-center justify-center animate-pulse-glow">
                        <Zap className="w-8 h-8 text-background" />
                      </div>
                      <p className="text-lg font-semibold text-foreground">
                        {chargingSession.status === "charging" ? "Charging Active" : "Charging Paused"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {chargingSession.chargingSpeed} kW
                      </p>
                    </div>
                    
                    {/* Animated charging flow */}
                    {chargingSession.status === "charging" && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary opacity-50">
                        <div className="w-8 h-full bg-white/80 animate-charging-flow"></div>
                      </div>
                    )}
                  </div>

                  {/* Control Buttons */}
                  <div className="flex gap-3">
                    <Button
                      onClick={handlePauseResume}
                      variant={chargingSession.status === "charging" ? "outline" : "default"}
                      className="flex-1"
                      disabled={chargingSession.status === "completed"}
                    >
                      {chargingSession.status === "charging" ? (
                        <>
                          <Pause className="w-4 h-4 mr-2" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Resume
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleStop}
                      variant="destructive"
                      className="flex-1"
                      disabled={chargingSession.status === "completed"}
                    >
                      <Square className="w-4 h-4 mr-2" />
                      Stop
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Details Sidebar */}
            <div className="space-y-6">
              {/* Time Info */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Clock className="w-4 h-4 text-primary" />
                    Time Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Started:</span>
                    <span className="text-sm font-medium">{chargingSession.startTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Est. End:</span>
                    <span className="text-sm font-medium">{chargingSession.estimatedEndTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Remaining:</span>
                    <span className="text-sm font-medium">{getEstimatedTime()}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Cost Info */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <DollarSign className="w-4 h-4 text-primary" />
                    Cost Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Current Cost:</span>
                    <span className="text-lg font-bold text-primary">${chargingSession.cost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Rate:</span>
                    <span className="text-sm font-medium">$0.35/kWh</span>
                  </div>
                </CardContent>
              </Card>

              {/* Station Info */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <MapPin className="w-4 h-4 text-primary" />
                    Station Info
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium">{chargingSession.stationName}</p>
                  <p className="text-xs text-muted-foreground">Charger #3</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChargingStatus;