import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Star, Send, CheckCircle, ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Feedback = {
  id: number;
  user_id?: number;
  feedback: string;
  created_at: string;
  username?: string;
};

const FeedbackSystem = () => {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [experience, setExperience] = useState<"excellent" | "good" | "average" | "poor" | "">("");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [recentFeedback, setRecentFeedback] = useState<Feedback[]>([]);
  const [loadingFeedback, setLoadingFeedback] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/feedbacks')
      .then(res => res.json())
      .then(data => {
        setRecentFeedback(data.feedbacks ? data.feedbacks.slice(0, 5) : []);
        setLoadingFeedback(false);
      })
      .catch(() => setLoadingFeedback(false));
  }, []);

  const handleRatingClick = (star: number) => {
    setRating(star);
  };

  const handleExperienceSelect = (exp: "excellent" | "good" | "average" | "poor") => {
    setExperience(exp);
  };

  const handleSubmitFeedback = async () => {
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting.",
        variant: "destructive"
      });
      return;
    }

    // Get user from localStorage if logged in
    let user_id = null;
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      if (user && user.id) user_id = user.id;
    } catch {}

    // Send feedback to backend
    try {
      const res = await fetch('http://localhost:5000/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id,
          feedback: `Rating: ${rating}, Experience: ${experience}, Comment: ${comment}`
        })
      });
      if (res.ok) {
        setSubmitted(true);
        toast({
          title: "Feedback Submitted!",
          description: "Thank you for your feedback. It helps us improve our service.",
        });
        setTimeout(() => {
          setRating(0);
          setExperience("");
          setComment("");
          setSubmitted(false);
        }, 3000);
      } else {
        toast({
          title: "Submission Failed",
          description: "Could not submit feedback. Please try again later.",
          variant: "destructive"
        });
      }
    } catch (err) {
      toast({
        title: "Submission Error",
        description: "An error occurred. Please try again later.",
        variant: "destructive"
      });
    }
  };

  const getExperienceColor = (exp: string) => {
    switch (exp) {
      case "excellent": return "bg-success";
      case "good": return "bg-primary";
      case "average": return "bg-warning";
      case "poor": return "bg-destructive";
      default: return "bg-muted";
    }
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Share Your Feedback
            </h2>
            <p className="text-muted-foreground text-lg">
              Help us improve your charging experience
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Feedback Form */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  Rate Your Experience
                </CardTitle>
                <CardDescription>
                  Your feedback helps us provide better service
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {!submitted ? (
                  <>
                    {/* Star Rating */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Overall Rating</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            className="transition-all hover:scale-110"
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            onClick={() => handleRatingClick(star)}
                          >
                            <Star
                              className={`w-8 h-8 ${
                                star <= (hoveredRating || rating)
                                  ? "fill-primary text-primary"
                                  : "text-muted-foreground"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      {rating > 0 && (
                        <p className="text-sm text-muted-foreground">
                          {rating === 1 && "Poor"}
                          {rating === 2 && "Below Average"}
                          {rating === 3 && "Average"}
                          {rating === 4 && "Good"}
                          {rating === 5 && "Excellent"}
                        </p>
                      )}
                    </div>

                    {/* Experience Quick Select */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium">How was your experience?</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { value: "excellent", label: "Excellent", icon: <ThumbsUp className="w-4 h-4" /> },
                          { value: "good", label: "Good", icon: <ThumbsUp className="w-4 h-4" /> },
                          { value: "average", label: "Average", icon: <MessageSquare className="w-4 h-4" /> },
                          { value: "poor", label: "Poor", icon: <ThumbsDown className="w-4 h-4" /> }
                        ].map((item) => (
                          <Button
                            key={item.value}
                            variant={experience === item.value ? "default" : "outline"}
                            className="justify-start gap-2"
                            onClick={() => handleExperienceSelect(item.value as any)}
                          >
                            {item.icon}
                            {item.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Comment */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Additional Comments (Optional)</label>
                      <Textarea
                        placeholder="Tell us more about your experience..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="min-h-[100px] resize-none"
                      />
                    </div>

                    <Button
                      onClick={handleSubmitFeedback}
                      className="w-full bg-gradient-electric text-background font-medium hover:shadow-glow-primary transition-all"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Submit Feedback
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Thank You!
                    </h3>
                    <p className="text-muted-foreground">
                      Your feedback has been submitted successfully.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Feedback */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Recent Reviews
                </CardTitle>
                <CardDescription>
                  See what other users are saying
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {loadingFeedback ? (
                  <div>Loading reviews...</div>
                ) : recentFeedback.length === 0 ? (
                  <div>No reviews yet.</div>
                ) : (
                  recentFeedback.map((feedback) => {
                    // Parse feedback string: "Rating: 5, Experience: excellent, Comment: ..."
                    let rating = 0, experience = '', comment = '';
                    const match = feedback.feedback.match(/Rating: (\d+), Experience: ([^,]+), Comment: (.*)/);
                    if (match) {
                      rating = parseInt(match[1], 10);
                      experience = match[2];
                      comment = match[3];
                    } else {
                      comment = feedback.feedback;
                    }
                    const displayName = feedback.username ? feedback.username : 'Anonymous';
                    return (
                      <div key={feedback.id} className="border border-border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-foreground">{displayName}</span>
                          <span className="text-xs text-muted-foreground">{new Date(feedback.created_at).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          {/* Star rating */}
                          {[1,2,3,4,5].map((star) => (
                            <Star key={star} className={`w-4 h-4 ${star <= rating ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                          ))}
                          {rating > 0 && <span className="text-sm text-muted-foreground ml-1">{rating}/5</span>}
                          {/* Experience badge */}
                          {experience && (
                            <Badge className={`ml-2 text-white ${getExperienceColor(experience)}`}>{experience.charAt(0).toUpperCase() + experience.slice(1)}</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground whitespace-pre-line">{comment}</div>
                      </div>
                    );
                  })
                )}
                <div className="text-center mt-2">
                  <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                    View All Reviews
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeedbackSystem;