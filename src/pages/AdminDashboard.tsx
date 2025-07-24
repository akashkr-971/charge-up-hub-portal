    import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "../components/ui/use-toast";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [newStation, setNewStation] = useState({
    name: '',
    address: '',
    status: 'active',
    availableSlots: 0,
    totalSlots: 0,
    power: '',
    price: '',
    rating: 0,
    amenities: ''
  });
  const [addingStation, setAddingStation] = useState(false);

  const handleAddStation = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingStation(true);
    try {
      const res = await fetch('http://localhost:5000/api/stations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStation)
      });
      if (res.ok) {
        setNewStation({ name: '', address: '', status: 'active', availableSlots: 0, totalSlots: 0, power: '', price: '', rating: 0, amenities: '' });
        // Refresh stations
        const stationsRes = await fetch('http://localhost:5000/api/stations');
        const stationsData = await stationsRes.json();
        setStations(Array.isArray(stationsData.stations) ? stationsData.stations : []);
      }
    } finally {
      setAddingStation(false);
    }
  };
  const [users, setUsers] = useState<any[]>([]);
  const [stations, setStations] = useState<any[]>([]); // Keep for future
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]); // Placeholder for future integration
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("http://localhost:5000/api/users").then(res => res.json()),
      fetch("http://localhost:5000/api/vehicles").then(res => res.json()),
      fetch("http://localhost:5000/api/feedbacks").then(res => res.json()),
      fetch("http://localhost:5000/api/stations").then(res => res.json()),
      // Payments API can be integrated later
    ])
      .then(([usersData, vehiclesData, reviewsData, stationsData]) => {
        console.log('Fetched users:', usersData);
        console.log('Fetched vehicles:', vehiclesData);
        console.log('Fetched reviews:', reviewsData);
        console.log('Fetched stations:', stationsData);
        setUsers(Array.isArray(usersData.users) ? usersData.users : []);
        setVehicles(Array.isArray(vehiclesData.vehicles) ? vehiclesData.vehicles : []);
        setReviews(Array.isArray(reviewsData.feedbacks) ? reviewsData.feedbacks : []);
        setStations(Array.isArray(stationsData.stations) ? stationsData.stations : []);
      })
      .catch((err) => {
        console.error('Error fetching admin dashboard data:', err);
        setUsers([]);
        setVehicles([]);
        setReviews([]);
        setStations([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-muted p-4">
      <Card className="w-full max-w-6xl mx-auto bg-background/95 backdrop-blur-sm">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between text-center gap-4">
          <CardTitle className="text-2xl font-bold">Admin Dashboard</CardTitle>
          <button
            className="bg-destructive hover:bg-destructive/90 text-white font-semibold px-4 py-2 rounded transition-all"
            onClick={() => {
              localStorage.removeItem('user');
              window.location.href = '/login';
            }}
          >
            Logout
          </button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="mb-6 flex flex-wrap gap-2">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
              <TabsTrigger value="stations">Charging Stations</TabsTrigger>
              <TabsTrigger value="add-station">Add Station</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
            </TabsList>

            {/* Users Tab */}
            <TabsContent value="users">
              <h2 className="font-semibold text-lg mb-2">All Users</h2>
              {loading ? (
                <div className="text-muted-foreground py-4">Loading...</div>
              ) : users.length === 0 ? (
                <div className="text-muted-foreground py-4">No users found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((u: any) => (
                        <TableRow key={u.id}>
                          <TableCell>{u.id}</TableCell>
                          <TableCell>{u.username}</TableCell>
                          <TableCell>{u.email}</TableCell>
                          <TableCell>
                            <Badge variant={u.role === "admin" ? "destructive" : "secondary"}>{u.role}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>

            {/* Vehicles Tab */}
            <TabsContent value="vehicles">
              <h2 className="font-semibold text-lg mb-2">All Vehicles</h2>
              {loading ? (
                <div className="text-muted-foreground py-4">Loading...</div>
              ) : vehicles.length === 0 ? (
                <div className="text-muted-foreground py-4">No vehicles found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>User ID</TableHead>
                        <TableHead>Vehicle Number</TableHead>
                        <TableHead>Model</TableHead>
                        <TableHead>Brand</TableHead>
                        <TableHead>Year</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vehicles.map((v: any) => (
                        <TableRow key={v.id}>
                          <TableCell>{v.id}</TableCell>
                          <TableCell>{v.user_id}</TableCell>
                          <TableCell>{v.vehicle_number}</TableCell>
                          <TableCell>{v.model}</TableCell>
                          <TableCell>{v.brand}</TableCell>
                          <TableCell>{v.year || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="stations">
              <h2 className="font-semibold text-lg mb-2">All Charging Stations</h2>
              {loading ? (
                <div className="text-muted-foreground py-4">Loading...</div>
              ) : stations.length === 0 ? (
                <div className="text-muted-foreground py-4">No stations found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Slots</TableHead>
                        <TableHead>Power</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Amenities</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stations.map((s: any, idx: number) => (
                        <TableRow key={s.id}>
                          <TableCell>{s.id}</TableCell>
                          <TableCell>
                            <input className="w-full bg-transparent border-b border-border focus:outline-none" value={s.name} onChange={e => {
                              const updated = [...stations]; updated[idx].name = e.target.value; setStations(updated);
                            }} />
                          </TableCell>
                          <TableCell>
                            <input className="w-full bg-transparent border-b border-border focus:outline-none" value={s.address} onChange={e => {
                              const updated = [...stations]; updated[idx].address = e.target.value; setStations(updated);
                            }} />
                          </TableCell>
                          <TableCell>
                            <select className="bg-transparent border-b border-border" value={s.status} onChange={e => {
                              const updated = [...stations]; updated[idx].status = e.target.value; setStations(updated);
                            }}>
                              <option value="online">Online</option>
                              <option value="offline">Offline</option>
                              <option value="maintenance">Maintenance</option>
                            </select>
                          </TableCell>
                          <TableCell>
                            <input type="number" className="w-16 bg-transparent border-b border-border focus:outline-none" value={s.availableSlots} onChange={e => {
                              const updated = [...stations]; updated[idx].availableSlots = Number(e.target.value); setStations(updated);
                            }} />/
                            <input type="number" className="w-16 bg-transparent border-b border-border focus:outline-none" value={s.totalSlots} onChange={e => {
                              const updated = [...stations]; updated[idx].totalSlots = Number(e.target.value); setStations(updated);
                            }} />
                          </TableCell>
                          <TableCell>
                            <input className="w-20 bg-transparent border-b border-border focus:outline-none" value={s.power || ''} onChange={e => {
                              const updated = [...stations]; updated[idx].power = e.target.value; setStations(updated);
                            }} />
                          </TableCell>
                          <TableCell>
                            <input className="w-20 bg-transparent border-b border-border focus:outline-none" value={s.price || ''} onChange={e => {
                              const updated = [...stations]; updated[idx].price = e.target.value; setStations(updated);
                            }} />
                          </TableCell>
                          <TableCell>
                            <input className="w-16 bg-transparent border-b border-border focus:outline-none" value={s.rating || ''} onChange={e => {
                              const updated = [...stations]; updated[idx].rating = e.target.value; setStations(updated);
                            }} />
                          </TableCell>
                          <TableCell>
                            <input className="w-32 bg-transparent border-b border-border focus:outline-none" value={s.amenities || ''} onChange={e => {
                              const updated = [...stations]; updated[idx].amenities = e.target.value; setStations(updated);
                            }} />
                          </TableCell>
                          <TableCell className="flex gap-2">
                            <button className="px-2 py-1 bg-primary text-white rounded text-xs" onClick={async () => {
                              const res = await fetch(`http://localhost:5000/api/stations/${s.id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(s)
                              });
                              if (res.ok) {
                                toast({ title: 'Station updated', description: 'Station updated successfully', variant: 'default' });
                              } else {
                                toast({ title: 'Update failed', description: 'Could not update station', variant: 'destructive' });
                              }
                            }}>Update</button>
                            <button className="px-2 py-1 bg-destructive text-white rounded text-xs" onClick={async () => {
                              if (window.confirm('Delete this station?')) {
                                const res = await fetch(`http://localhost:5000/api/stations/${s.id}`, { method: 'DELETE' });
                                if (res.ok) {
                                  setStations(stations.filter(st => st.id !== s.id));
                                  toast({ title: 'Station deleted', description: 'Station deleted successfully', variant: 'default' });
                                } else {
                                  toast({ title: 'Delete failed', description: 'Could not delete station', variant: 'destructive' });
                                }
                              }
                            }}>Delete</button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>

            {/* Add Station Tab */}
            <TabsContent value="add-station">
              <h2 className="font-semibold text-lg mb-2">Add New Charging Station</h2>
              <form className="max-w-xl mx-auto bg-background rounded-lg shadow p-6 flex flex-col gap-4 border border-border" onSubmit={handleAddStation}>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1 text-foreground">Name</label>
                    <input required className="w-full border border-border bg-muted px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary text-foreground" placeholder="Station Name" value={newStation.name} onChange={e => setNewStation(s => ({...s, name: e.target.value}))} />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1 text-foreground">Address</label>
                    <input required className="w-full border border-border bg-muted px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary text-foreground" placeholder="Address" value={newStation.address} onChange={e => setNewStation(s => ({...s, address: e.target.value}))} />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1 text-foreground">Status</label>
                    <select required className="w-full border border-border bg-muted px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary text-foreground" value={newStation.status} onChange={e => setNewStation(s => ({...s, status: e.target.value}))}>
                      <option value="active">Active</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="offline">Offline</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1 text-foreground">Available Slots</label>
                    <input required type="number" className="w-full border border-border bg-muted px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary text-foreground" placeholder="Available Slots" value={newStation.availableSlots} onChange={e => setNewStation(s => ({...s, availableSlots: Number(e.target.value)}))} />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1 text-foreground">Total Slots</label>
                    <input required type="number" className="w-full border border-border bg-muted px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary text-foreground" placeholder="Total Slots" value={newStation.totalSlots} onChange={e => setNewStation(s => ({...s, totalSlots: Number(e.target.value)}))} />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1 text-foreground">Power</label>
                    <input className="w-full border border-border bg-muted px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary text-foreground" placeholder="Power (e.g. 150 kW)" value={newStation.power} onChange={e => setNewStation(s => ({...s, power: e.target.value}))} />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1 text-foreground">Price</label>
                    <input className="w-full border border-border bg-muted px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary text-foreground" placeholder="Price (e.g. ₹18/kWh)" value={newStation.price} onChange={e => setNewStation(s => ({...s, price: e.target.value}))} />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1 text-foreground">Rating</label>
                    <input className="w-full border border-border bg-muted px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary text-foreground" placeholder="Rating (e.g. 4.5)" value={newStation.rating} onChange={e => setNewStation(s => ({...s, rating: Number(e.target.value)}))} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-foreground">Amenities (comma separated)</label>
                  <input className="w-full border border-border bg-muted px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary text-foreground" placeholder="e.g. WiFi, Restroom, Cafe" value={newStation.amenities} onChange={e => setNewStation(s => ({...s, amenities: e.target.value}))} />
                </div>
                <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2 rounded transition-all disabled:opacity-60" disabled={addingStation}>{addingStation ? 'Adding...' : 'Add Station'}</button>
              </form>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews">
              <h2 className="font-semibold text-lg mb-2">All Reviews</h2>
              {loading ? (
                <div className="text-muted-foreground py-4">Loading...</div>
              ) : reviews.length === 0 ? (
                <div className="text-muted-foreground py-4">No reviews found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Stars</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reviews.map((r: any) => (
                        <TableRow key={r.id}>
                          <TableCell>{r.id}</TableCell>
                          <TableCell>{r.username || r.user_id}</TableCell>
                          <TableCell>{r.stars ? '★'.repeat(Number(r.stars)) : ''}</TableCell>
                          <TableCell>{r.description || r.feedback || ''}</TableCell>
                          <TableCell>{r.created_at ? new Date(r.created_at).toLocaleDateString() : (r.date ? new Date(r.date).toLocaleDateString() : '')}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>

            {/* Payments Tab (placeholder) */}
            <TabsContent value="payments">
              <h2 className="font-semibold text-lg mb-2">All Payments</h2>
              <div className="text-muted-foreground py-4">
                Payment integration coming soon.
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
