import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Bot, 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  MessageSquare,
  FileText,
  Shield
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <Bot className="h-8 w-8 text-primary" />,
      title: "AI-Powered Insights",
      description: "Leverage advanced AI to predict sales trends, generate reports, and get intelligent business recommendations."
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-success" />,
      title: "Sales Analytics",
      description: "Track revenue daily, weekly, and monthly with beautiful charts and predictive analytics."
    },
    {
      icon: <Users className="h-8 w-8 text-accent" />,
      title: "Customer Management",
      description: "Manage customer information, service bookings, and interaction history in one place."
    },
    {
      icon: <Calendar className="h-8 w-8 text-warning" />,
      title: "Appointment Scheduling",
      description: "Smart appointment management with automated reminders and calendar integration."
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-primary" />,
      title: "AI FAQ Assistant",
      description: "Get intelligent FAQ suggestions based on customer queries using AI-powered responses."
    },
    {
      icon: <FileText className="h-8 w-8 text-success" />,
      title: "Auto-Generated Reports",
      description: "AI creates comprehensive business reports and performance summaries automatically."
    },
    {
      icon: <DollarSign className="h-8 w-8 text-accent" />,
      title: "Revenue Tracking",
      description: "Monitor your business performance with detailed financial analytics and forecasting."
    },
    {
      icon: <Shield className="h-8 w-8 text-warning" />,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with data encryption and reliable cloud infrastructure."
    }
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Powerful Features for Modern Businesses
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to manage, analyze, and grow your business with the power of artificial intelligence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4">{feature.icon}</div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;