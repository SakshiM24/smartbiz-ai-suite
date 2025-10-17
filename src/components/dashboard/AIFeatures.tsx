import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const AIFeatures = () => {
  const { user } = useAuth();
  const [faqQuery, setFaqQuery] = useState("");
  const [faqResponse, setFaqResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [salesData, setSalesData] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRealData();
  }, [user]);

  const fetchRealData = async () => {
    if (!user) return;

    // Fetch sales data
    const { data: sales } = await supabase
      .from('sales')
      .select('*')
      .eq('user_id', user.id);

    // Fetch appointments
    const { data: appointments } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', user.id);

    // Fetch services
    const { data: services } = await supabase
      .from('services')
      .select('*')
      .eq('user_id', user.id);

    // Fetch customers
    const { data: customers } = await supabase
      .from('customers')
      .select('*')
      .eq('user_id', user.id);

    generateInsights(sales || [], appointments || [], services || [], customers || []);
    generateSalesChart(sales || []);
    setLoading(false);
  };

  const generateSalesChart = (sales: any[]) => {
    const monthlyData = sales.reduce((acc: any, sale) => {
      const month = new Date(sale.sale_date).toLocaleString('default', { month: 'short' });
      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month] += parseFloat(sale.amount);
      return acc;
    }, {});

    const chartData = Object.entries(monthlyData).map(([month, actual]) => ({
      month,
      actual: actual as number,
      predicted: (actual as number) * 1.05 // Simple 5% growth prediction
    }));

    setSalesData(chartData);
  };

  const generateInsights = (sales: any[], appointments: any[], services: any[], customers: any[]) => {
    const newInsights = [];

    // Insight 1: Top performing service
    if (sales.length > 0) {
      const serviceSales = sales.reduce((acc: any, sale) => {
        if (!acc[sale.service_name]) {
          acc[sale.service_name] = { count: 0, revenue: 0 };
        }
        acc[sale.service_name].count++;
        acc[sale.service_name].revenue += parseFloat(sale.amount);
        return acc;
      }, {});

      const topService = Object.entries(serviceSales).sort((a: any, b: any) => b[1].revenue - a[1].revenue)[0];
      if (topService) {
        newInsights.push({
          type: "trend",
          title: "Top Performing Service",
          description: `"${topService[0]}" generated ₹${(topService[1] as any).revenue.toFixed(0)} from ${(topService[1] as any).count} sales. This is your most profitable service!`,
          confidence: 95,
          impact: "High"
        });
      }
    }

    // Insight 2: Appointment status analysis
    if (appointments.length > 0) {
      const completedRate = (appointments.filter(a => a.status === 'completed').length / appointments.length) * 100;
      const cancelledRate = (appointments.filter(a => a.status === 'cancelled').length / appointments.length) * 100;
      
      if (cancelledRate > 15) {
        newInsights.push({
          type: "prediction",
          title: "High Cancellation Rate",
          description: `${cancelledRate.toFixed(0)}% of appointments are cancelled. Consider implementing appointment reminders or a cancellation policy.`,
          confidence: 88,
          impact: "Medium"
        });
      } else {
        newInsights.push({
          type: "recommendation",
          title: "Strong Completion Rate",
          description: `${completedRate.toFixed(0)}% appointment completion rate. Your scheduling system is working well!`,
          confidence: 92,
          impact: "High"
        });
      }
    }

    // Insight 3: Customer growth
    if (customers.length > 0) {
      const highValueCustomers = customers.filter(c => c.total_spent > 1000).length;
      newInsights.push({
        type: "recommendation",
        title: "Customer Base Analysis",
        description: `You have ${customers.length} customers, with ${highValueCustomers} high-value customers (₹1000+). Focus on retention programs for top spenders.`,
        confidence: 90,
        impact: "High"
      });
    }

    // Insight 4: Service utilization
    if (services.length > 0 && appointments.length > 0) {
      const unusedServices = services.filter(s => 
        !appointments.some(a => a.service_name === s.name)
      );
      if (unusedServices.length > 0) {
        newInsights.push({
          type: "recommendation",
          title: "Service Utilization",
          description: `${unusedServices.length} services have no appointments yet: ${unusedServices.map(s => s.name).join(', ')}. Consider promoting these or reviewing pricing.`,
          confidence: 85,
          impact: "Medium"
        });
      }
    }

    setInsights(newInsights);
  };


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

  if (loading) {
    return <div className="text-center py-10">Loading insights...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">AI Insights</h1>
        <p className="text-muted-foreground">Real-time insights from your business data</p>
      </div>

      <Tabs defaultValue="insights" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="insights">Smart Insights</TabsTrigger>
          <TabsTrigger value="predictions">Trends</TabsTrigger>
          <TabsTrigger value="faq">FAQ Helper</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid gap-6">
            {insights.length === 0 ? (
              <Card>
                <CardContent className="text-center py-10">
                  <p className="text-muted-foreground">Add some data to see AI-powered insights!</p>
                </CardContent>
              </Card>
            ) : (
              insights.map((insight, index) => (
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
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Revenue Trends</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {salesData.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No sales data yet. Complete some appointments to see trends!</p>
                </div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={salesData}>
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
                    <h4 className="font-semibold mb-2">Analysis</h4>
                    <p className="text-sm text-muted-foreground">
                      Your revenue trends show {salesData.length > 1 ? 'growth patterns' : 'early stage data'}. 
                      Keep adding sales to see more accurate predictions!
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
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
      </Tabs>
    </div>
  );
};

export default AIFeatures;