import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration?: number;
  category?: string;
  is_active: boolean;
}

const ServiceManagement = () => {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "60",
    category: "",
  });

  useEffect(() => {
    fetchServices();
  }, [user]);

  const fetchServices = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('user_id', user.id)
      .order('name');

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch services",
        variant: "destructive",
      });
    } else {
      setServices(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const serviceData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      duration: parseInt(formData.duration),
      category: formData.category,
      user_id: user.id,
    };

    if (editingService) {
      const { error } = await supabase
        .from('services')
        .update(serviceData)
        .eq('id', editingService.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update service",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Service updated successfully",
        });
      }
    } else {
      const { error } = await supabase.from('services').insert(serviceData);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create service",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Service created successfully",
        });
      }
    }

    setIsDialogOpen(false);
    setEditingService(null);
    setFormData({ name: "", description: "", price: "", duration: "60", category: "" });
    fetchServices();
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description || "",
      price: service.price.toString(),
      duration: service.duration?.toString() || "60",
      category: service.category || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    const { error } = await supabase.from('services').delete().eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete service",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Service deleted successfully",
      });
      fetchServices();
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Service Management</h1>
          <p className="text-muted-foreground">Define your services and pricing</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingService(null);
            setFormData({ name: "", description: "", price: "", duration: "60", category: "" });
          }
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Service
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingService ? "Edit Service" : "Add New Service"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Service Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (min)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Haircut, Spa, Consulting"
                />
              </div>
              <Button type="submit" className="w-full">
                {editingService ? "Update Service" : "Add Service"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="text-center py-10">
              <p className="text-muted-foreground">No services yet. Create your first service!</p>
            </CardContent>
          </Card>
        ) : (
          services.map((service) => (
            <Card key={service.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{service.name}</h3>
                      {service.category && (
                        <span className="text-sm text-muted-foreground">{service.category}</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(service)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(service.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {service.description && (
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-2xl font-bold text-primary">₹{service.price}</span>
                    {service.duration && (
                      <span className="text-sm text-muted-foreground">{service.duration} min</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ServiceManagement;
