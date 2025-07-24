import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Admin = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/feedbacks")
      .then((res) => res.json())
      .then((data) => {
        // Some APIs return { feedback: [...] } or { feedbacks: [...] }
        setFeedbacks(data.feedbacks || data.feedback || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="flex justify-end max-w-3xl mx-auto mb-4">
        <button
          className="px-4 py-2 rounded bg-destructive text-white hover:bg-destructive/80 transition"
          onClick={() => {
            localStorage.removeItem('user');
            window.location.href = '/login';
          }}
        >
          Logout
        </button>
      </div>
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Feedback Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : feedbacks.length === 0 ? (
            <div>No feedback found.</div>
          ) : (
            <ul className="space-y-4">
              {feedbacks.map((fb) => (
                <li key={fb.id} className="border-b pb-2">
                  <div className="font-semibold">User ID: {fb.user_id || 'Anonymous'}</div>
                  <div className="text-muted-foreground text-sm">{fb.feedback}</div>
                  <div className="text-xs text-muted-foreground">{new Date(fb.created_at).toLocaleString()}</div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;
