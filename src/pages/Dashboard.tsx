import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Camera, User, FileText, Award, CalendarDays, DollarSign, Inbox, Settings, PlusCircle } from "lucide-react";

import ProfileTab from "@/components/dashboard/ProfileTab";
import CertificatesTab from "@/components/dashboard/CertificatesTab";
import BadgesTab from "@/components/dashboard/BadgesTab";
import MemberBookingsTab from "@/components/dashboard/MemberBookingsTab";
import CaregiverRevenueTab from "@/components/dashboard/CaregiverRevenueTab";
import CaregiverRequestsTab from "@/components/dashboard/CaregiverRequestsTab";
import CaregiverSettingsTab from "@/components/dashboard/CaregiverSettingsTab";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    profile, setProfile,
    role,
    certificates,
    rewards,
    bookings,
    caregiverProfile, setCaregiverProfile,
    loading,
    refetchCertificates,
    refetchBookings,
    refetchCaregiverProfile,
  } = useDashboardData(user);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  // Realtime bookings subscription
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("bookings-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, () => {
        refetchBookings();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const ext = file.name.split(".").pop();
    const filePath = `${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage.from("certificates").upload(filePath, file, { upsert: true });
    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
      return;
    }

    const { data: urlData } = supabase.storage.from("certificates").getPublicUrl(filePath);
    await supabase.from("profiles").update({ avatar_url: urlData.publicUrl }).eq("user_id", user.id);
    setProfile((p) => ({ ...p, avatar_url: urlData.publicUrl }));
    toast({ title: "Photo updated!" });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  const isCaregiver = role === "caregiver";
  const isMember = role === "family";

  const initials = (profile.full_name || user?.email || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl border border-border shadow-card p-6 md:p-8 mb-6"
          >
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative group">
                <Avatar className="w-24 h-24 border-4 border-primary/20">
                  <AvatarImage src={profile.avatar_url || undefined} alt="Profile" />
                  <AvatarFallback className="text-2xl font-bold gradient-primary text-primary-foreground">{initials}</AvatarFallback>
                </Avatar>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 rounded-full bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <Camera className="w-6 h-6 text-primary-foreground" />
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              </div>
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-2xl font-bold text-foreground">{profile.full_name || "Your Profile"}</h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                  <Badge variant="secondary" className="capitalize">
                    {profile.status === "caregiver" ? "Caregiver" : "Member"}
                  </Badge>
                  {rewards.length > 0 && (
                    <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                      <Award className="w-3 h-3 mr-1" />
                      {rewards.length} Badge{rewards.length !== 1 ? "s" : ""}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
              </div>
            </div>
          </motion.div>

          {/* Role-based Tabs */}
          {isCaregiver ? (
            <Tabs defaultValue="requests" className="space-y-6">
              <TabsList className="w-full grid grid-cols-5 h-12 rounded-xl">
                <TabsTrigger value="requests" className="rounded-lg gap-1.5">
                  <Inbox className="w-4 h-4" />
                  <span className="hidden sm:inline">Requests</span>
                </TabsTrigger>
                <TabsTrigger value="revenue" className="rounded-lg gap-1.5">
                  <DollarSign className="w-4 h-4" />
                  <span className="hidden sm:inline">Revenue</span>
                </TabsTrigger>
                <TabsTrigger value="certificates" className="rounded-lg gap-1.5">
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">Certs</span>
                </TabsTrigger>
                <TabsTrigger value="badges" className="rounded-lg gap-1.5">
                  <Award className="w-4 h-4" />
                  <span className="hidden sm:inline">Badges</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="rounded-lg gap-1.5">
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Settings</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="requests">
                <CaregiverRequestsTab bookings={bookings} onRefresh={refetchBookings} />
              </TabsContent>
              <TabsContent value="revenue">
                <CaregiverRevenueTab bookings={bookings} />
              </TabsContent>
              <TabsContent value="certificates">
                <CertificatesTab user={user!} certificates={certificates} onRefresh={refetchCertificates} />
              </TabsContent>
              <TabsContent value="badges">
                <BadgesTab rewards={rewards} isCaregiver />
              </TabsContent>
              <TabsContent value="settings">
                <CaregiverSettingsTab user={user!} caregiverProfile={caregiverProfile} setCaregiverProfile={setCaregiverProfile} onRefresh={refetchCaregiverProfile} />
              </TabsContent>
            </Tabs>
          ) : (
            <Tabs defaultValue="bookings" className="space-y-6">
              <TabsList className="w-full grid grid-cols-3 h-12 rounded-xl">
                <TabsTrigger value="bookings" className="rounded-lg gap-1.5">
                  <CalendarDays className="w-4 h-4" />
                  <span className="hidden sm:inline">My Bookings</span>
                </TabsTrigger>
                <TabsTrigger value="profile" className="rounded-lg gap-1.5">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger value="badges" className="rounded-lg gap-1.5">
                  <Award className="w-4 h-4" />
                  <span className="hidden sm:inline">Badges</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="bookings">
                <MemberBookingsTab bookings={bookings} />
              </TabsContent>
              <TabsContent value="profile">
                <ProfileTab user={user!} profile={profile} setProfile={setProfile} />
              </TabsContent>
              <TabsContent value="badges">
                <BadgesTab rewards={rewards} isCaregiver={false} />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
