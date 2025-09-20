import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bot, 
  TrendingUp, 
  MessageSquare, 
  FileText,
  Send,
  Lightbulb,
  BarChart3,
  Target,
  Zap
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useToast } from "@/hooks/use-toast";

const AIFeatures = () => {
  const [faqQuery, setFaqQuery] = useState("");
  const [faqResponse, setFaqResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock AI predictions and insights
  const salesPrediction = [
    { month: "Jan", actual: 8400, predicted: 8600 },
    { month: "Feb", actual: 9200, predicted: 9400 },
    { month: "Mar", actual: 10100, predicted: 10200 },
    { month: "Apr", actual: 11200, predicted: 11100 },
    { month: "May", actual: 10800, predicted: 10900 },
    { month: "Jun", actual: 12456, predicted: 12300 },
    { month: "Jul", predicted: 13200 },
    { month: "Aug", predicted: 13800 },
    { month: "Sep", predicted: 14100 }
  ];

  const aiInsights = [
    {
      type: "trend",
      title: "Peak Hours Identified",
      description: "Your busiest hours are 2-4 PM on weekdays. Consider offering discounts during slower morning hours to increase utilization.",
      confidence: 92,
      impact: "High"
    },
    {
      type: "recommendation",
      title: "Service Optimization",
      description: "Hair styling services have the highest profit margin. Consider promoting these services or training staff to offer premium styling options.",
      confidence: 88,
      impact: "Medium"
    },
    {
      type: "prediction",
      title: "Customer Retention Alert",
      description: "3 high-value customers haven't booked in the last 6 weeks. Consider sending personalized re-engagement offers.",
      confidence: 95,
      impact: "High"
    }
  ];

  const generatedReports = [
    {
      title: "Monthly Performance Report - December 2024",
      type: "Performance",
      generatedAt: "2024-12-20",
      summary: "Revenue increased 15.2% compared to last month. Customer satisfaction scores remain high at 4.8/5."
    },
    {
      title: "Customer Behavior Analysis - Q4 2024",
      type: "Analytics",
      generatedAt: "2024-12-15",
      summary: "Identified key customer segments and their preferred services. Repeat customer rate at 78%."
    },
    {
      title: "Competitive Analysis Report",
      type: "Market Research",
      generatedAt: "2024-12-10",
      summary: "Market position analysis showing competitive advantages in service quality and customer experience."
    }
  ];

  const handleFaqQuery = async () => {
    if (!faqQuery.trim()) return;

    setIsLoading(true);
    
    // Simulate AI processing
    setTimeout(() => {
      // Mock AI responses based on common queries
      const responses = {
        "price": "For pricing information, our standard services range from $45-120. Hair cuts start at $45, styling at $65, and color treatments at $85-120. We offer package deals for regular customers with 10% discounts on bundled services.",
        "appointment": "To book an appointment, customers can call us at (555) 123-4567, book online through our website, or use our mobile app. We recommend booking 2-3 days in advance for popular time slots.",
        "cancellation": "Our cancellation policy allows free cancellations up to 24 hours before the appointment. Cancellations within 24 hours may incur a 50% service fee. No-shows will be charged the full service amount.",
        "hours": "We're open Monday-Friday 9 AM to 7 PM, Saturday 9 AM to 6 PM, and closed Sundays. Holiday hours may vary - please check our website or call for specific holiday schedules.",
        "services": "We offer a full range of hair services including cuts, styling, coloring, highlights, perms, and treatments. We also provide manicures, pedicures, facials, and massage therapy. All services are performed by licensed professionals."
      };

      const query = faqQuery.toLowerCase();
      let response = "I'd be happy to help with that! ";

      if (query.includes("price") || query.includes("cost") || query.includes("how much")) {
        response += responses.price;
      } else if (query.includes("appointment") || query.includes("book") || query.includes("schedule")) {
        response += responses.appointment;
      } else if (query.includes("cancel") || query.includes("reschedule")) {
        response += responses.cancellation;
      } else if (query.includes("hours") || query.includes("open") || query.includes("time")) {
        response += responses.hours;
      } else if (query.includes("service") || query.includes("what do you offer")) {
        response += responses.services;
      } else {
        response += "For specific questions about our services, pricing, or policies, please call us at (555) 123-4567 or visit our website. Our staff will be happy to provide detailed information about your specific needs.";
      }

      setFaqResponse(response);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">AI Features</h1>
        <p className="text-muted-foreground">Leverage artificial intelligence to grow your business</p>
      </div>

      <Tabs defaultValue="predictions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="faq">FAQ Assistant</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="predictions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Sales Trend Prediction</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={salesPrediction}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))" }}
                    name="Actual Revenue"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="predicted" 
                    stroke="hsl(var(--accent))" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: "hsl(var(--accent))" }}
                    name="Predicted Revenue"
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">AI Prediction Summary</h4>
                <p className="text-sm text-muted-foreground">
                  Based on historical data and market trends, revenue is predicted to grow by 18% over the next 3 months. 
                  Peak performance is expected in September with projected revenue of $14,100.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid gap-6">
            {aiInsights.map((insight, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      {insight.type === "trend" && <BarChart3 className="h-6 w-6 text-primary mt-1" />}
                      {insight.type === "recommendation" && <Lightbulb className="h-6 w-6 text-warning mt-1" />}
                      {insight.type === "prediction" && <Target className="h-6 w-6 text-accent mt-1" />}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{insight.title}</h3>
                        <p className="text-muted-foreground mt-1">{insight.description}</p>
                        <div className="flex items-center space-x-4 mt-3">
                          <Badge variant="outline">
                            Confidence: {insight.confidence}%
                          </Badge>
                          <Badge variant={insight.impact === "High" ? "default" : "secondary"}>
                            Impact: {insight.impact}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>AI FAQ Assistant</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Customer Query</label>
                <Textarea
                  placeholder="Enter a customer question to get an AI-generated response..."
                  value={faqQuery}
                  onChange={(e) => setFaqQuery(e.target.value)}
                  rows={3}
                />
              </div>
              <Button 
                onClick={handleFaqQuery} 
                disabled={!faqQuery.trim() || isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Bot className="h-4 w-4 mr-2 animate-spin" />
                    Generating Response...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Generate AI Response
                  </>
                )}
              </Button>
              
              {faqResponse && (
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Bot className="h-4 w-4 mr-2" />
                    AI-Generated Response
                  </h4>
                  <p className="text-sm leading-relaxed">{faqResponse}</p>
                </div>
              )}

              <div className="mt-6">
                <h4 className="font-semibold mb-3">Try These Sample Queries:</h4>
                <div className="grid gap-2">
                  {[
                    "What are your prices for hair cuts?",
                    "How can I book an appointment?",
                    "What is your cancellation policy?",
                    "What are your business hours?",
                    "What services do you offer?"
                  ].map((sample, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="justify-start text-left h-auto py-2"
                      onClick={() => setFaqQuery(sample)}
                    >
                      {sample}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Auto-Generated Reports</span>
              </CardTitle>
              <Button>
                <Bot className="h-4 w-4 mr-2" />
                Generate New Report
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {generatedReports.map((report, index) => (
                  <div key={index} className="p-4 bg-muted rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{report.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{report.summary}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant="outline">{report.type}</Badge>
                          <span className="text-xs text-muted-foreground">Generated: {report.generatedAt}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="outline" size="sm">Download</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIFeatures;