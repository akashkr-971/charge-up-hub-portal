import { useState, useEffect, useRef } from "react";
import loginBg from "@/assets/login-bg.jpg";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Profile = () => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    password: "",
    confirmPassword: "",
    vehicleNumber: user?.vehicleNumber || "",
    vehicleMake: user?.vehicleMake || "",
    vehicleModel: user?.vehicleModel || "",
    vehicleYear: user?.vehicleYear || "",
  });

  // Only run this effect once on mount to fetch vehicle details
  useEffect(() => {
    if (user?.id) {
      fetch(`http://localhost:5000/api/vehicle/${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.vehicle) {
            setFormData(f => ({
              ...f,
              vehicleNumber: data.vehicle.vehicle_number || "",
              vehicleMake: data.vehicle.brand || "",
              vehicleModel: data.vehicle.model || "",
              vehicleYear: data.vehicle.year || "",
            }));
            // Sync vehicle details into user object and localStorage
            const updatedUser = {
              ...user,
              vehicleNumber: data.vehicle.vehicle_number || "",
              vehicleMake: data.vehicle.brand || "",
              vehicleModel: data.vehicle.model || "",
              vehicleYear: data.vehicle.year || "",
            };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep formData in sync with user when user changes (but not vehicle fields)
  useEffect(() => {
    setFormData(f => ({
      ...f,
      username: user?.username || "",
      email: user?.email || "",
      password: "",
      confirmPassword: "",
      // Don't reset vehicle fields here
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.username, user?.email]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => {
    setEditMode(false);
    setFormData({
      username: user?.username || "",
      email: user?.email || "",
      password: "",
      confirmPassword: "",
      vehicleNumber: user?.vehicleNumber || "",
      vehicleMake: user?.vehicleMake || "",
      vehicleModel: user?.vehicleModel || "",
      vehicleYear: user?.vehicleYear || "",
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    // Update vehicle details in backend
    if (user?.id) {
      await fetch(`http://localhost:5000/api/vehicle/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicle_number: formData.vehicleNumber,
          brand: formData.vehicleMake,
          model: formData.vehicleModel,
          year: formData.vehicleYear,
        })
      });
    }
    // Only update password if provided (local only)
    const updatedUser = {
      ...user,
      username: formData.username,
      email: formData.email,
      ...(formData.password ? { password: formData.password } : {})
    };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setEditMode(false);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 text-center">
          <CardHeader>
            <CardTitle>Not logged in</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please log in to view your profile.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: `url(${loginBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/60 z-0" />
      <div className="relative z-10 w-full flex items-center justify-center">
        <Card className="w-full max-w-lg bg-background/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Profile</CardTitle>
          </CardHeader>
          <CardContent>
            {editMode ? (
              <form onSubmit={handleSave} className="space-y-4">
                {/* ...existing code... */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Name</Label>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Leave blank to keep current"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Leave blank to keep current"
                    />
                  </div>
                </div>
                <div className="pt-4 border-t space-y-4">
                  <div className="flex flex-col items-start mb-2">
                    <span className="font-bold text-xl mb-1">Register Your Vehicle</span>
                    <span className="font-semibold text-lg">Vehicle Details</span>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicleNumber">Vehicle Number / License Plate</Label>
                    <Input
                      id="vehicleNumber"
                      name="vehicleNumber"
                      type="text"
                      value={formData.vehicleNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vehicleMake">Vehicle Make</Label>
                      <Input
                        id="vehicleMake"
                        name="vehicleMake"
                        type="text"
                        value={formData.vehicleMake}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vehicleYear">Year</Label>
                      <Input
                        id="vehicleYear"
                        name="vehicleYear"
                        type="text"
                        value={formData.vehicleYear}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicleModel">Vehicle Model</Label>
                    <Input
                      id="vehicleModel"
                      name="vehicleModel"
                      type="text"
                      value={formData.vehicleModel}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button type="submit" className="bg-gradient-electric text-background font-medium">Save</Button>
                  <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                {/* ...existing code... */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Name</Label>
                    <div className="font-medium text-lg">{user.username}</div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <div className="font-medium text-lg">{user.email}</div>
                  </div>
                </div>
                <div className="pt-4 border-t space-y-2">
                  <span className="font-bold text-xl mb-1 block">Register Your Vehicle</span>
                  <span className="font-semibold text-lg">Vehicle Details</span>
                  <div>
                    <Label className="text-muted-foreground">Vehicle Number</Label>
                    <div className="font-medium">{user.vehicleNumber || '-'}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Make</Label>
                      <div className="font-medium">{user.vehicleMake || '-'}</div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Year</Label>
                      <div className="font-medium">{user.vehicleYear || '-'}</div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Model</Label>
                    <div className="font-medium">{user.vehicleModel || '-'}</div>
                  </div>
                </div>
                <Button className="bg-gradient-electric text-background font-medium w-full" onClick={handleEdit}>Edit Profile</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
