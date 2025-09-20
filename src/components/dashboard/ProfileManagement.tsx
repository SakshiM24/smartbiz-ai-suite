import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Building, 
  Phone, 
  Mail, 
  MapPin,
  Clock,
  Calendar,
  Settings,
  Shield,
  Bell,
  Palette
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ProfileManagement = () => {
  const [profileData, setProfileData] = useState({
    firstName: localStorage.getItem("userName")?.split(" ")[0] || "John",
    lastName: localStorage.getItem("userName")?.split(" ")[1] || "Doe",
    email: localStorage.getItem("userEmail") || "john@business.com",
    phone: "+1 (555) 123-4567",
    businessName: localStorage.getItem("businessName") || "My Business",
    businessType: "Hair Salon",
    address: "123 Main Street, City, State 12345",
    description: "A modern salon offering premium hair and beauty services with experienced stylists.",
    website: "www.mybusiness.com",
    socialMedia: {
      facebook: "@mybusiness",
      instagram: "@mybusiness",
      twitter: "@mybusiness"
    }
  });

  const [businessHours, setBusinessHours] = useState({
    monday: { open: "09:00", close: "18:00", closed: false },
    tuesday: { open: "09:00", close: "18:00", closed: false },
    wednesday: { open: "09:00", close: "18:00", closed: false },
    thursday: { open: "09:00", close: "19:00", closed: false },
    friday: { open: "09:00", close: "19:00", closed: false },
    saturday: { open: "09:00", close: "17:00", closed: false },
    sunday: { open: "10:00", close: "16:00", closed: true }
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    appointmentReminders: true,
    marketingEmails: false,
    systemUpdates: true
  });

  const { toast } = useToast();

  const handleProfileSave = () => {
    // Update localStorage
    localStorage.setItem("userName", `${profileData.firstName} ${profileData.lastName}`);
    localStorage.setItem("userEmail", profileData.email);
    localStorage.setItem("businessName", profileData.businessName);

    toast({
      title: "Profile updated",
      description: "Your profile information has been successfully updated.",
    });
  };

  const handleBusinessHoursSave = () => {
    toast({
      title: "Business hours updated",
      description: "Your business hours have been successfully updated.",
    });
  };

  const handleNotificationsSave = () => {
    toast({
      title: "Notification preferences updated",
      description: "Your notification settings have been saved.",
    });
  };

  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profile Management</h1>
        <p className="text-muted-foreground">Manage your business profile and settings</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="business">Business Info</TabsTrigger>
          <TabsTrigger value="hours">Business Hours</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="" alt="Profile" />
                  <AvatarFallback className="text-lg">
                    {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline">Change Photo</Button>
                  <p className="text-sm text-muted-foreground mt-1">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>
              </div>

              {/* Personal Info Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  />
                </div>
              </div>

              <Button onClick={handleProfileSave}>Save Profile</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>Business Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={profileData.businessName}
                    onChange={(e) => setProfileData({...profileData, businessName: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="businessType">Business Type</Label>
                  <Input
                    id="businessType"
                    value={profileData.businessType}
                    onChange={(e) => setProfileData({...profileData, businessType: e.target.value})}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Business Address</Label>
                  <Input
                    id="address"
                    value={profileData.address}
                    onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={profileData.website}
                    onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="businessPhone">Business Phone</Label>
                  <Input
                    id="businessPhone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="description">Business Description</Label>
                  <Textarea
                    id="description"
                    rows={3}
                    value={profileData.description}
                    onChange={(e) => setProfileData({...profileData, description: e.target.value})}
                  />
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="font-semibold mb-4">Social Media</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      placeholder="@yourbusiness"
                      value={profileData.socialMedia.facebook}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        socialMedia: {...profileData.socialMedia, facebook: e.target.value}
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      placeholder="@yourbusiness"
                      value={profileData.socialMedia.instagram}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        socialMedia: {...profileData.socialMedia, instagram: e.target.value}
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input
                      id="twitter"
                      placeholder="@yourbusiness"
                      value={profileData.socialMedia.twitter}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        socialMedia: {...profileData.socialMedia, twitter: e.target.value}
                      })}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleProfileSave}>Save Business Info</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Business Hours</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {days.map((day) => {
                const dayData = businessHours[day as keyof typeof businessHours];
                return (
                  <div key={day} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-24">
                        <span className="font-medium capitalize">{day}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={!dayData.closed}
                          onChange={(e) => setBusinessHours({
                            ...businessHours,
                            [day]: {...dayData, closed: !e.target.checked}
                          })}
                        />
                        <span className="text-sm">Open</span>
                      </div>
                    </div>
                    
                    {!dayData.closed && (
                      <div className="flex items-center space-x-2">
                        <Input
                          type="time"
                          value={dayData.open}
                          onChange={(e) => setBusinessHours({
                            ...businessHours,
                            [day]: {...dayData, open: e.target.value}
                          })}
                          className="w-32"
                        />
                        <span>to</span>
                        <Input
                          type="time"
                          value={dayData.close}
                          onChange={(e) => setBusinessHours({
                            ...businessHours,
                            [day]: {...dayData, close: e.target.value}
                          })}
                          className="w-32"
                        />
                      </div>
                    )}
                    
                    {dayData.closed && (
                      <Badge variant="secondary">Closed</Badge>
                    )}
                  </div>
                );
              })}
              
              <Button onClick={handleBusinessHoursSave}>Save Hours</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.emailNotifications}
                    onChange={(e) => setNotifications({
                      ...notifications,
                      emailNotifications: e.target.checked
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Appointment Reminders</p>
                    <p className="text-sm text-muted-foreground">Get reminders about upcoming appointments</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.appointmentReminders}
                    onChange={(e) => setNotifications({
                      ...notifications,
                      appointmentReminders: e.target.checked
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Marketing Emails</p>
                    <p className="text-sm text-muted-foreground">Receive promotional content and tips</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.marketingEmails}
                    onChange={(e) => setNotifications({
                      ...notifications,
                      marketingEmails: e.target.checked
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">System Updates</p>
                    <p className="text-sm text-muted-foreground">Important system and security notifications</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.systemUpdates}
                    onChange={(e) => setNotifications({
                      ...notifications,
                      systemUpdates: e.target.checked
                    })}
                  />
                </div>
              </div>
              
              <Button onClick={handleNotificationsSave}>Save Preferences</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Two-Factor Authentication
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Download Data
              </Button>
              <Button variant="destructive" className="w-full justify-start">
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileManagement;