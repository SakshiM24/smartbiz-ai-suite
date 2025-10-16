import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, subMonths } from "date-fns";

const SalesTracking = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [loading, setLoading] = useState(true);

  const [dailyData, setDailyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [serviceData, setServiceData] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);

  const totalRevenue = monthlyData.reduce((sum, month) => sum + month.revenue, 0);
  const totalTransactions = monthlyData.reduce((sum, month) => sum + month.transactions, 0);
  const avgTransaction = totalRevenue / totalTransactions || 0;

  useEffect(() => {
    if (!user) return;

    const fetchSalesData = async () => {
      try {
        setLoading(true);

        // Fetch all sales for the user
        const { data: sales, error } = await supabase
          .from('sales')
          .select('*')
          .eq('user_id', user.id)
          .order('sale_date', { ascending: true });

        if (error) throw error;

        if (!sales || sales.length === 0) {
          setLoading(false);
          return;
        }

        // Process daily data (last 30 days)
        const last30Days = eachDayOfInterval({
          start: subMonths(new Date(), 1),
          end: new Date()
        });

        const dailyRevenue = last30Days.map(day => {
          const dayStr = format(day, 'yyyy-MM-dd');
          const daySales = sales.filter(s => s.sale_date === dayStr);
          return {
            date: format(day, 'MMM dd'),
            revenue: daySales.reduce((sum, s) => sum + Number(s.amount), 0),
            transactions: daySales.length
          };
        });
        setDailyData(dailyRevenue);

        // Process weekly data (last 12 weeks)
        const last12Weeks = eachWeekOfInterval({
          start: subMonths(new Date(), 3),
          end: new Date()
        });

        const weeklyRevenue = last12Weeks.map((week, idx) => {
          const weekStart = format(week, 'yyyy-MM-dd');
          const weekSales = sales.filter(s => {
            const saleWeek = format(new Date(s.sale_date), 'yyyy-MM-dd');
            return saleWeek >= weekStart && saleWeek < format(new Date(week.getTime() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
          });
          return {
            week: `W${idx + 1}`,
            revenue: weekSales.reduce((sum, s) => sum + Number(s.amount), 0),
            transactions: weekSales.length
          };
        });
        setWeeklyData(weeklyRevenue);

        // Process monthly data (last 12 months)
        const last12Months = eachMonthOfInterval({
          start: subMonths(new Date(), 11),
          end: new Date()
        });

        const monthlyRevenue = last12Months.map(month => {
          const monthStr = format(month, 'yyyy-MM');
          const monthSales = sales.filter(s => s.sale_date?.startsWith(monthStr));
          return {
            month: format(month, 'MMM yyyy'),
            revenue: monthSales.reduce((sum, s) => sum + Number(s.amount), 0),
            transactions: monthSales.length
          };
        });
        setMonthlyData(monthlyRevenue);

        // Process service breakdown
        const serviceRevenue: Record<string, number> = {};
        sales.forEach(sale => {
          if (!serviceRevenue[sale.service_name]) {
            serviceRevenue[sale.service_name] = 0;
          }
          serviceRevenue[sale.service_name] += Number(sale.amount);
        });

        const totalServiceRevenue = Object.values(serviceRevenue).reduce((sum: number, val) => sum + Number(val), 0);
        const colors = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--destructive))'];
        
        const serviceBreakdown = Object.entries(serviceRevenue).map(([name, revenue], idx) => ({
          name,
          revenue: Number(revenue).toFixed(0),
          value: totalServiceRevenue > 0 ? ((Number(revenue) / totalServiceRevenue) * 100).toFixed(1) : 0,
          color: colors[idx % colors.length]
        }));
        setServiceData(serviceBreakdown);

        // Recent transactions (last 10)
        const recent = sales.slice(-10).reverse().map(sale => ({
          id: sale.id,
          customer: sale.customer_name,
          service: sale.service_name,
          amount: Number(sale.amount),
          date: format(new Date(sale.sale_date), 'MMM dd, yyyy'),
          status: sale.payment_status || 'completed'
        }));
        setRecentTransactions(recent);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching sales data:', error);
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [user]);

  // Function to export report
  const exportReport = () => {
    const reportData = {
      totalRevenue,
      totalTransactions,
      avgTransaction,
      businessName: localStorage.getItem("businessName") || "Your Business",
      generatedDate: new Date().toLocaleDateString(),
      monthlyData,
      serviceData,
      recentTransactions
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `sales-report-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (loading) {
    return <div className="text-center py-10">Loading sales data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sales Analytics</h1>
          <p className="text-muted-foreground">Track your revenue and business performance</p>
        </div>
        <Button variant="outline" onClick={exportReport}>
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
                <p className="text-2xl font-bold">₹{totalRevenue.toLocaleString() || "0"}</p>
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
                <p className="text-2xl font-bold">₹{avgTransaction.toFixed(0)}</p>
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
                <p className="text-2xl font-bold">₹{monthlyData.length > 0 ? monthlyData[monthlyData.length - 1].revenue.toLocaleString() : "0"}</p>
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
                    ₹{service.revenue} ({service.value}%)
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
            {recentTransactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No transactions yet. Add your first sale!</p>
            ) : (
              recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-medium">{transaction.customer}</p>
                    <p className="text-sm text-muted-foreground">{transaction.service}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {transaction.amount > 0 ? `₹${transaction.amount}` : "Free"}
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
            ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesTracking;