export { BookingHistory };



import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BookingHistory = () => {
  const [user] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      fetch(`http://localhost:5000/api/bookings/${user.id}`)
        .then(res => res.json())
        .then(data => setBookings(Array.isArray(data.bookings) ? data.bookings : []))
        .catch(() => setBookings([]))
        .finally(() => setLoading(false));
    }
  }, [user?.id]);

  const today = new Date().toISOString().split('T')[0];
  const current = bookings.filter((b) => b.date >= today);
  const history = bookings.filter((b) => b.date < today);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted">
      <Card className="w-full max-w-2xl bg-background/95 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">My Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            <h2 className="font-semibold text-lg mb-2">Current Bookings</h2>
            {loading ? (
              <div className="text-muted-foreground py-4">Loading...</div>
            ) : current.length === 0 ? (
              <div className="text-muted-foreground py-4">No current bookings.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border rounded-lg mb-4">
                  <thead>
                    <tr className="bg-muted">
                      <th className="px-3 py-2 text-left">Station</th>
                      <th className="px-3 py-2 text-left">Date</th>
                      <th className="px-3 py-2 text-left">Time</th>
                      <th className="px-3 py-2 text-left">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {current.map((b, i) => (
                      <tr key={b.id || i} className="border-b last:border-0">
                        <td className="px-3 py-2">{b.station_name}</td>
                        <td className="px-3 py-2">{b.date}</td>
                        <td className="px-3 py-2">{b.time}</td>
                        <td className="px-3 py-2">{b.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div>
            <h2 className="font-semibold text-lg mb-2">Booking History</h2>
            {loading ? (
              <div className="text-muted-foreground py-4">Loading...</div>
            ) : history.length === 0 ? (
              <div className="text-muted-foreground py-4">No past bookings.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border rounded-lg">
                  <thead>
                    <tr className="bg-muted">
                      <th className="px-3 py-2 text-left">Station</th>
                      <th className="px-3 py-2 text-left">Date</th>
                      <th className="px-3 py-2 text-left">Time</th>
                      <th className="px-3 py-2 text-left">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((b, i) => (
                      <tr key={b.id || i} className="border-b last:border-0">
                        <td className="px-3 py-2">{b.station_name}</td>
                        <td className="px-3 py-2">{b.date}</td>
                        <td className="px-3 py-2">{b.time}</td>
                        <td className="px-3 py-2">{b.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


