import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import CustomerManagement from "@/components/dashboard/CustomerManagement";
import AppointmentManagement from "@/components/dashboard/AppointmentManagement";
import SalesTracking from "@/components/dashboard/SalesTracking";
import AIFeatures from "@/components/dashboard/AIFeatures";
import ProfileManagement from "@/components/dashboard/ProfileManagement";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <DashboardOverview />;
      case "customers":
        return <CustomerManagement />;
      case "appointments":
        return <AppointmentManagement />;
      case "sales":
        return <SalesTracking />;
      case "ai":
        return <AIFeatures />;
      case "profile":
        return <ProfileManagement />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
};

export default Dashboard;