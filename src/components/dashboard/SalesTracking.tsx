import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  BarChart3,
  Download
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  Area,
  AreaChart
} from "recharts";

const SalesTracking = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");

  // Mock sales data
  const dailyData = [
    { date: "Dec 14", revenue: 450, transactions: 8 },
    { date: "Dec 15", revenue: 680, transactions: 12 },
    { date: "Dec 16", revenue: 520, transactions: 9 },
    { date: "Dec 17", revenue: 750, transactions: 15 },
    { date: "Dec 18", revenue: 620, transactions: 11 },
    { date: "Dec 19", revenue: 890, transactions: 16 },
    { date: "Dec 20", revenue: 720, transactions: 13 }
  ];

  const weeklyData = [
    { week: "Week 1", revenue: 3200, transactions: 58 },
    { week: "Week 2", revenue: 3800, transactions: 67 },
    { week: "Week 3", revenue: 4100, transactions: 72 },
    { week: "Week 4", revenue: 3600, transactions: 61 }
  ];

  const monthlyData = [
    { month: "Jul", revenue: 8400, transactions: 156, customers: 45 },
    { month: "Aug", revenue: 9200, transactions: 168, customers: 52 },
    { month: "Sep", revenue: 10100, transactions: 184, customers: 58 },
    { month: "Oct", revenue: 11200, transactions: 198, customers: 64 },
    { month: "Nov", revenue: 10800, transactions: 192, customers: 61 },
    { month: "Dec", revenue: 12456, transactions: 215, customers: 68 }
  ];

  const serviceData = [
    { name: "Hair Styling", value: 35, revenue: 4200, color: "hsl(var(--primary))" },
    { name: "Massage", value: 25, revenue: 3000, color: "hsl(var(--success))" },
    { name: "Manicure", value: 20, revenue: 2400, color: "hsl(var(--accent))" },
    { name: "Facial", value: 15, revenue: 1800, color: "hsl(var(--warning))" },
    { name: "Other", value: 5, revenue: 600, color: "hsl(var(--muted-foreground))" }
  ];

  const recentTransactions = [
    { id: 1, customer: "Sarah Johnson", service: "Hair Styling", amount: 85, date: "2024-12-20", status: "paid" },
    { id: 2, customer: "Mike Chen", service: "Massage", amount: 120, date: "2024-12-20", status: "paid" },
    { id: 3, customer: "Emily Davis", service: "Manicure", amount: 45, date: "2024-12-19", status: "pending" },
    { id: 4, customer: "David Wilson", service: "Consultation", amount: 0, date: "2024-12-19", status: "completed" },
    { id: 5, customer: "Lisa Brown", service: "Facial", amount: 75, date: "2024-12-18", status: "paid" }
  ];

  const totalRevenue = monthlyData.reduce((sum, month) => sum + month.revenue, 0);
  const totalTransactions = monthlyData.reduce((sum, month) => sum + month.transactions, 0);
  const avgTransaction = totalRevenue / totalTransactions;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sales Analytics</h1>
          <p className="text-muted-foreground">Track your revenue and business performance</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-success mr-1" />
                  <span className="text-sm text-success">+12.5%</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Transactions</p>
                <p className="text-2xl font-bold">{totalTransactions}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-success mr-1" />
                  <span className="text-sm text-success">+8.3%</span>
                </div>
              </div>
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Transaction</p>
                <p className="text-2xl font-bold">${avgTransaction.toFixed(0)}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-success mr-1" />
                  <span className="text-sm text-success">+3.7%</span>
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">${monthlyData[monthlyData.length - 1].revenue.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-success mr-1" />
                  <span className="text-sm text-success">+15.2%</span>
                </div>
              </div>
              <Calendar className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <TabsList>
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={
                selectedPeriod === "daily" ? dailyData :
                selectedPeriod === "weekly" ? weeklyData : monthlyData
              }>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={selectedPeriod === "daily" ? "date" : selectedPeriod === "weekly" ? "week" : "month"} />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary) / 0.2)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Service Breakdown */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Revenue by Service</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {serviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {serviceData.map((service, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: service.color }}
                    />
                    <span className="text-sm">{service.name}</span>
                  </div>
                  <div className="text-sm font-medium">
                    ${service.revenue} ({service.value}%)
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-medium">{transaction.customer}</p>
                    <p className="text-sm text-muted-foreground">{transaction.service}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {transaction.amount > 0 ? `$${transaction.amount}` : "Free"}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">{transaction.date}</span>
                    <Badge 
                      variant={
                        transaction.status === "paid" ? "default" :
                        transaction.status === "pending" ? "secondary" : "outline"
                      }
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesTracking;