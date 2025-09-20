import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Users, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background to-muted">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            AI-Powered Smart Service Platform
            <span className="block text-primary">for Small Businesses</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Automate tasks, improve customer support, and gain actionable insights with our affordable AI-driven platform designed specifically for small businesses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/register">
              <Button size="lg" className="text-lg px-8">
                Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Learn More
              </Button>
            </a>
          </div>
        </div>

        {/* Feature Icons */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="text-center p-6 bg-card rounded-lg border border-border">
            <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">AI Analytics</h3>
            <p className="text-muted-foreground">Predict sales trends and get actionable insights</p>
          </div>
          <div className="text-center p-6 bg-card rounded-lg border border-border">
            <Users className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Customer Management</h3>
            <p className="text-muted-foreground">Manage customers and their service bookings</p>
          </div>
          <div className="text-center p-6 bg-card rounded-lg border border-border">
            <Calendar className="h-12 w-12 text-success mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Smart Scheduling</h3>
            <p className="text-muted-foreground">Effortlessly manage appointments and bookings</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;