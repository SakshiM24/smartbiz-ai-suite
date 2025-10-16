import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Calendar as CalendarIcon, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface Appointment {
  id: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  service_name: string;
  appointment_date: string;
  appointment_time: string;
  duration: number;
  status: string;
  notes?: string;
}

const AppointmentManagement = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [newAppointment, setNewAppointment] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    service_name: "",
    service_id: "",
    appointment_date: "",
    appointment_time: "",
    duration: 60,
    notes: "",
  });

  useEffect(() => {
    fetchAppointments();
    fetchServices();
  }, [user]);

  const fetchServices = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('name');

    if (!error) {
      setServices(data || []);
    }
  };

  const fetchAppointments = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', user.id)
      .order('appointment_date', { ascending: true })
      .order('appointment_time', { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch appointments",
        variant: "destructive",
      });
    } else {
      setAppointments(data || []);
    }
    setLoading(false);
  };

  const handleAddAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const { error } = await supabase.from('appointments').insert({
      ...newAppointment,
      user_id: user.id,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create appointment",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Appointment created successfully",
      });
      setIsDialogOpen(false);
      setNewAppointment({
        customer_name: "",
        customer_email: "",
        customer_phone: "",
        service_name: "",
        service_id: "",
        appointment_date: "",
        appointment_time: "",
        duration: 60,
        notes: "",
      });
      fetchAppointments();
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const appointment = appointments.find(a => a.id === id);
    if (!appointment) return;

    const { error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
      return;
    }

    // If marking as completed, offer to create sale
    if (status === 'completed' && appointment.status !== 'completed') {
      const service = services.find(s => s.name === appointment.service_name);
      if (service) {
        const createSale = confirm(`Create a sale record for ₹${service.price}?`);
        if (createSale) {
          await supabase.from('sales').insert({
            user_id: user!.id,
            customer_name: appointment.customer_name,
            service_name: appointment.service_name,
            service_id: service.id,
            appointment_id: id,
            amount: service.price,
            sale_date: appointment.appointment_date,
            payment_status: 'completed',
          });
          toast({
            title: "Success",
            description: "Sale recorded successfully",
          });
        }
      }
    }
    
    fetchAppointments();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Appointment Management</h1>
          <p className="text-muted-foreground">Schedule and manage appointments</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Schedule New Appointment</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddAppointment} className="space-y-4">
              <div>
                <Label htmlFor="customer_name">Customer Name *</Label>
                <Input
                  id="customer_name"
                  value={newAppointment.customer_name}
                  onChange={(e) => setNewAppointment({ ...newAppointment, customer_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="customer_email">Customer Email</Label>
                <Input
                  id="customer_email"
                  type="email"
                  value={newAppointment.customer_email}
                  onChange={(e) => setNewAppointment({ ...newAppointment, customer_email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="customer_phone">Customer Phone</Label>
                <Input
                  id="customer_phone"
                  value={newAppointment.customer_phone}
                  onChange={(e) => setNewAppointment({ ...newAppointment, customer_phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="service_name">Service *</Label>
                <Select
                  value={newAppointment.service_id}
                  onValueChange={(value) => {
                    const service = services.find(s => s.id === value);
                    if (service) {
                      setSelectedService(service);
                      setNewAppointment({
                        ...newAppointment,
                        service_id: value,
                        service_name: service.name,
                        duration: service.duration || 60,
                      });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name} - ₹{service.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {services.length === 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    No services available. Create services first!
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="appointment_date">Date *</Label>
                  <Input
                    id="appointment_date"
                    type="date"
                    value={newAppointment.appointment_date}
                    onChange={(e) => setNewAppointment({ ...newAppointment, appointment_date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="appointment_time">Time *</Label>
                  <Input
                    id="appointment_time"
                    type="time"
                    value={newAppointment.appointment_time}
                    onChange={(e) => setNewAppointment({ ...newAppointment, appointment_time: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={newAppointment.duration}
                  onChange={(e) => setNewAppointment({ ...newAppointment, duration: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={newAppointment.notes}
                  onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full">Schedule Appointment</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {appointments.length === 0 ? (
          <Card>
            <CardContent className="text-center py-10">
              <p className="text-muted-foreground">No appointments scheduled. Create your first appointment!</p>
            </CardContent>
          </Card>
        ) : (
          appointments.map((appointment) => (
            <Card key={appointment.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(appointment.status)}
                      <h3 className="font-semibold text-lg">{appointment.customer_name}</h3>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        {appointment.appointment_date}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {appointment.appointment_time} ({appointment.duration} min)
                      </div>
                      <div className="font-medium">{appointment.service_name}</div>
                    </div>
                  </div>
                  <Select
                    value={appointment.status}
                    onValueChange={(value) => updateStatus(appointment.id, value)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AppointmentManagement;
