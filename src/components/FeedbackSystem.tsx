import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Star, Send, CheckCircle, ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Feedback {
  id: string;
  stationName: string;
  rating: number;
  experience: "excellent" | "good" | "average" | "poor";
  comment: string;
  date: string;
}

const FeedbackSystem = () => {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [experience, setExperience] = useState<"excellent" | "good" | "average" | "poor" | "">("");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const recentFeedback: Feedback[] = [
    {
      id: "1",
      stationName: "Downtown Electric Hub",
      rating: 5,
      experience: "excellent",
      comment: "Fast charging and great location. Very satisfied!",
      date: "2024-01-15"
    },
    {
      id: "2",
      stationName: "Mall Charging Center",
      rating: 4,
      experience: "good", 
      comment: "Good experience overall, but could use better signage.",
      date: "2024-01-10"
    }
  ];

  const handleRatingClick = (star: number) => {
    setRating(star);
  };

  const handleExperienceSelect = (exp: "excellent" | "good" | "average" | "poor") => {
    setExperience(exp);
  };

  const handleSubmitFeedback = () => {
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting.",
        variant: "destructive"
      });
      return;
    }

    setSubmitted(true);
    toast({
      title: "Feedback Submitted!",
      description: "Thank you for your feedback. It helps us improve our service.",
    });

    // Reset form after a delay
    setTimeout(() => {
      setRating(0);
      setExperience("");
      setComment("");
      setSubmitted(false);
    }, 3000);
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

  const getExperienceIcon = (exp: string) => {
    switch (exp) {
      case "excellent": return <ThumbsUp className="w-4 h-4" />;
      case "good": return <ThumbsUp className="w-4 h-4" />;
      case "average": return <MessageSquare className="w-4 h-4" />;
      case "poor": return <ThumbsDown className="w-4 h-4" />;
      default: return null;
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
                {recentFeedback.map((feedback) => (
                  <div key={feedback.id} className="border border-border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground">{feedback.stationName}</h4>
                      <Badge className={`text-white ${getExperienceColor(feedback.experience)}`}>
                        {getExperienceIcon(feedback.experience)}
                        <span className="ml-1 capitalize">{feedback.experience}</span>
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= feedback.rating
                              ? "fill-primary text-primary"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                      <span className="text-sm text-muted-foreground ml-2">
                        {feedback.rating}/5
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{feedback.comment}</p>
                    
                    <p className="text-xs text-muted-foreground">{feedback.date}</p>
                  </div>
                ))}
                
                <div className="text-center">
                  <Button variant="outline" size="sm">
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