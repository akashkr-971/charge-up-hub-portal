import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Zap, Clock, Star } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface ChargingStation {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  availableSlots: number;
  totalSlots: number;
  power: string;
  price: string;
  rating: number;
  status: 'Available' | 'Busy' | 'Maintenance';
  amenities: string[];
}

// Mock charging stations data near user location
const mockStations: ChargingStation[] = [
  {
    id: '1',
    name: 'Tesla Supercharger Station',
    address: '123 Main St, Downtown',
    lat: 28.6139,
    lng: 77.2090,
    availableSlots: 4,
    totalSlots: 8,
    power: '150kW',
    price: '₹8/kWh',
    rating: 4.8,
    status: 'Available',
    amenities: ['Fast Charging', 'WiFi', 'Restroom', 'Cafe']
  },
  {
    id: '2',
    name: 'ChargePoint Express',
    address: '456 Park Ave, Central',
    lat: 28.6219,
    lng: 77.2019,
    availableSlots: 2,
    totalSlots: 6,
    power: '100kW',
    price: '₹6/kWh',
    rating: 4.5,
    status: 'Available',
    amenities: ['Fast Charging', 'WiFi', 'Shopping Mall']
  },
  {
    id: '3',
    name: 'Electrify America Hub',
    address: '789 Business District',
    lat: 28.6059,
    lng: 77.2170,
    availableSlots: 0,
    totalSlots: 4,
    power: '200kW',
    price: '₹10/kWh',
    rating: 4.6,
    status: 'Busy',
    amenities: ['Ultra Fast Charging', 'Restroom']
  },
  {
    id: '4',
    name: 'EV Power Station',
    address: '321 Tech Park, Sector 5',
    lat: 28.6179,
    lng: 77.2249,
    availableSlots: 6,
    totalSlots: 10,
    power: '75kW',
    price: '₹5/kWh',
    rating: 4.2,
    status: 'Available',
    amenities: ['Charging', 'WiFi', 'Food Court']
  }
];

// Custom component to handle map centering to user location
const LocationMarker = ({ userLocation }: { userLocation: [number, number] | null }) => {
  const map = useMap();
  
  useEffect(() => {
    if (userLocation) {
      map.setView(userLocation, 13);
    }
  }, [userLocation, map]);

  if (!userLocation) return null;

  const userIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return (
    <Marker position={userLocation} icon={userIcon}>
      <Popup>
        <div className="text-center">
          <MapPin className="w-4 h-4 mx-auto mb-1 text-blue-500" />
          <span className="font-medium">Your Location</span>
        </div>
      </Popup>
    </Marker>
  );
};

const ChargingStationMap = () => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [selectedStation, setSelectedStation] = useState<ChargingStation | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const getUserLocation = () => {
    setIsLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to Delhi coordinates
          setUserLocation([28.6139, 77.2090]);
          setIsLoadingLocation(false);
        }
      );
    } else {
      // Fallback to Delhi coordinates
      setUserLocation([28.6139, 77.2090]);
      setIsLoadingLocation(false);
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-500';
      case 'Busy': return 'bg-red-500';
      case 'Maintenance': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const chargingIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return (
    <div className="h-[600px] w-full flex">
      {/* Map Section */}
      <div className="flex-1 relative">
        <MapContainer
          center={userLocation || [28.6139, 77.2090]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          className="rounded-l-lg"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <LocationMarker userLocation={userLocation} />
          
          {mockStations.map((station) => (
            <Marker
              key={station.id}
              position={[station.lat, station.lng]}
              icon={chargingIcon}
              eventHandlers={{
                click: () => setSelectedStation(station),
              }}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <h3 className="font-semibold mb-2">{station.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{station.address}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={station.status === 'Available' ? 'default' : 'destructive'}>
                      {station.status}
                    </Badge>
                    <span className="text-sm">{station.availableSlots}/{station.totalSlots} slots</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Zap className="w-3 h-3" />
                    <span>{station.power}</span>
                    <span className="mx-2">•</span>
                    <span>{station.price}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        
        <div className="absolute top-4 left-4 z-[1000]">
          <Button 
            onClick={getUserLocation} 
            disabled={isLoadingLocation}
            size="sm"
            className="bg-background/90 text-foreground border border-border hover:bg-background"
          >
            <MapPin className="w-4 h-4 mr-1" />
            {isLoadingLocation ? 'Locating...' : 'My Location'}
          </Button>
        </div>
      </div>

      {/* Station Details Sidebar */}
      <div className="w-80 bg-background border-l border-border rounded-r-lg p-4 overflow-y-auto">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Nearby Stations
        </h3>
        
        <div className="space-y-3">
          {mockStations.map((station) => (
            <Card 
              key={station.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedStation?.id === station.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedStation(station)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-sm">{station.name}</CardTitle>
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(station.status)}`} />
                </div>
                <p className="text-xs text-muted-foreground">{station.address}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {station.availableSlots}/{station.totalSlots} available
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    {station.rating}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {station.power}
                  </span>
                  <span className="font-medium">{station.price}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {station.amenities.slice(0, 2).map((amenity) => (
                    <Badge key={amenity} variant="secondary" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                  {station.amenities.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{station.amenities.length - 2}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChargingStationMap;