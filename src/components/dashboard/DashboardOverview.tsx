import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, DollarSign, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Stats {
  totalCustomers: number;
  totalAppointments: number;
  totalRevenue: number;
  todayAppointments: number;
}

const DashboardOverview = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalCustomers: 0,
    totalAppointments: 0,
    totalRevenue: 0,
    todayAppointments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];

      const [customersRes, appointmentsRes, salesRes, todayAppointmentsRes] = await Promise.all([
        supabase.from('customers').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('sales').select('amount').eq('user_id', user.id),
        supabase.from('appointments').select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('appointment_date', today),
      ]);

      const totalRevenue = salesRes.data?.reduce((sum, sale) => sum + Number(sale.amount), 0) || 0;

      setStats({
        totalCustomers: customersRes.count || 0,
        totalAppointments: appointmentsRes.count || 0,
        totalRevenue,
        todayAppointments: todayAppointmentsRes.count || 0,
      });
      setLoading(false);
    };

    fetchStats();
  }, [user]);

  const statsCards = [
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Total Appointments",
      value: stats.totalAppointments,
      icon: Calendar,
      color: "text-green-500",
    },
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-yellow-500",
    },
    {
      title: "Today's Appointments",
      value: stats.todayAppointments,
      icon: Clock,
      color: "text-purple-500",
    },
  ];

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome back! Here's your business summary.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center py-10 text-muted-foreground">
        <p>Start adding customers and appointments to see more insights!</p>
      </div>
    </div>
  );
};

export default DashboardOverview;
