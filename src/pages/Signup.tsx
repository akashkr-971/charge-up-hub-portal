import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, Eye, EyeOff, Car } from "lucide-react";
import signupBg from "@/assets/signup-bg.jpg";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    vehicleNumber: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    acceptTerms: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic will be provided later
    console.log("Signup form submitted:", formData);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${signupBg})` }}
      />
      <div className="absolute inset-0 bg-black/40" />
      <Card className="w-full max-w-lg relative z-10 backdrop-blur-sm bg-background/95">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-electric rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-background" />
            </div>
            <span className="text-xl font-bold text-foreground">EVCharge</span>
          </div>
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>Join thousands of EV drivers today</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            {/* Vehicle Details Section */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center space-x-2 mb-4">
                <Car className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Vehicle Details</h3>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vehicleNumber">Vehicle Number / License Plate</Label>
                <Input
                  id="vehicleNumber"
                  name="vehicleNumber"
                  type="text"
                  placeholder="e.g., ABC-1234"
                  value={formData.vehicleNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicleMake">Vehicle Make</Label>
                  <Select
                    value={formData.vehicleMake}
                    onValueChange={(value) => setFormData({...formData, vehicleMake: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select make" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tesla">Tesla</SelectItem>
                      <SelectItem value="bmw">BMW</SelectItem>
                      <SelectItem value="audi">Audi</SelectItem>
                      <SelectItem value="mercedes">Mercedes-Benz</SelectItem>
                      <SelectItem value="nissan">Nissan</SelectItem>
                      <SelectItem value="volkswagen">Volkswagen</SelectItem>
                      <SelectItem value="hyundai">Hyundai</SelectItem>
                      <SelectItem value="kia">Kia</SelectItem>
                      <SelectItem value="ford">Ford</SelectItem>
                      <SelectItem value="chevrolet">Chevrolet</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="vehicleYear">Year</Label>
                  <Select
                    value={formData.vehicleYear}
                    onValueChange={(value) => setFormData({...formData, vehicleYear: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => {
                        const year = new Date().getFullYear() - i;
                        return <SelectItem key={year} value={year.toString()}>{year}</SelectItem>;
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vehicleModel">Vehicle Model</Label>
                <Input
                  id="vehicleModel"
                  name="vehicleModel"
                  type="text"
                  placeholder="e.g., Model 3, i3, e-tron"
                  value={formData.vehicleModel}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="acceptTerms"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, acceptTerms: checked as boolean })
                }
                required
              />
              <Label htmlFor="acceptTerms" className="text-sm">
                I agree to the{" "}
                <Link to="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-electric text-background font-medium hover:shadow-glow-primary transition-all"
              disabled={!formData.acceptTerms || !formData.vehicleNumber || !formData.vehicleMake || !formData.vehicleModel || !formData.vehicleYear}
            >
              Create Account
            </Button>
            <div className="text-center">
              <span className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </span>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;