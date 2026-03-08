import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
  Camera,
  Upload,
  Shield,
  Award,
  FileText,
  Phone,
  Mail,
  User,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

type Profile = {
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
};

type Certificate = {
  id: string;
  certificate_name: string;
  certificate_type: string;
  status: string;
  file_url: string;
  created_at: string;
  verified_at: string | null;
};

type Reward = {
  id: string;
  reward_name: string;
  reward_type: string;
  awarded_at: string;
};

const statusConfig: Record<string, { icon: typeof CheckCircle; color: string; label: string }> = {
  approved: { icon: CheckCircle, color: "text-green-600", label: "Verified" },
  pending: { icon: Clock, color: "text-amber-500", label: "Pending" },
  rejected: { icon: XCircle, color: "text-destructive", label: "Rejected" },
};

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const certInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<Profile>({ full_name: null, phone: null, avatar_url: null });
  const [role, setRole] = useState<string | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");

  // Certificate upload state
  const [certName, setCertName] = useState("");
  const [certType, setCertType] = useState("nursing_license");

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchRole();
      fetchCertificates();
      fetchRewards();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, phone, avatar_url")
      .eq("user_id", user!.id)
      .single();
    if (data) {
      setProfile(data);
      setEditName(data.full_name || "");
      setEditPhone(data.phone || "");
    }
  };

  const fetchRole = async () => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user!.id)
      .single();
    if (data) setRole(data.role);
  };

  const fetchCertificates = async () => {
    const { data } = await supabase
      .from("certificates")
      .select("id, certificate_name, certificate_type, status, file_url, created_at, verified_at")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });
    if (data) setCertificates(data);
  };

  const fetchRewards = async () => {
    const { data } = await supabase
      .from("certificate_rewards")
      .select("id, reward_name, reward_type, awarded_at")
      .eq("user_id", user!.id)
      .order("awarded_at", { ascending: false });
    if (data) setRewards(data);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    const ext = file.name.split(".").pop();
    const filePath = `${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("certificates")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("certificates").getPublicUrl(filePath);

    await supabase
      .from("profiles")
      .update({ avatar_url: urlData.publicUrl })
      .eq("user_id", user.id);

    setProfile((p) => ({ ...p, avatar_url: urlData.publicUrl }));
    toast({ title: "Photo updated!" });
    setUploading(false);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: editName, phone: editPhone })
      .eq("user_id", user.id);

    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } else {
      setProfile((p) => ({ ...p, full_name: editName, phone: editPhone }));
      toast({ title: "Profile saved!" });
    }
    setSaving(false);
  };

  const handleCertUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !certName) return;

    setUploading(true);
    const ext = file.name.split(".").pop();
    const filePath = `${user.id}/certs/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("certificates")
      .upload(filePath, file);

    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("certificates").getPublicUrl(filePath);

    const { error: insertError } = await supabase.from("certificates").insert({
      user_id: user.id,
      certificate_name: certName,
      certificate_type: certType,
      file_url: urlData.publicUrl,
    });

    if (insertError) {
      toast({ title: "Error saving certificate", description: insertError.message, variant: "destructive" });
    } else {
      toast({ title: "Certificate uploaded!", description: "It will be reviewed shortly." });
      setCertName("");
      fetchCertificates();
    }
    setUploading(false);
  };

  const initials = (profile.full_name || user?.email || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  const isCaregiver = role === "caregiver";

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
              {/* Avatar */}
              <div className="relative group">
                <Avatar className="w-24 h-24 border-4 border-primary/20">
                  <AvatarImage src={profile.avatar_url || undefined} alt="Profile" />
                  <AvatarFallback className="text-2xl font-bold gradient-primary text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute inset-0 rounded-full bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <Camera className="w-6 h-6 text-primary-foreground" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </div>

              {/* Info */}
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-2xl font-bold text-foreground">
                  {profile.full_name || "Your Profile"}
                </h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                  <Badge variant="secondary" className="capitalize">
                    {role || "Member"}
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

          {/* Tabs */}
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="w-full grid grid-cols-3 h-12 rounded-xl">
              <TabsTrigger value="profile" className="rounded-lg gap-1.5">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              {isCaregiver && (
                <TabsTrigger value="certificates" className="rounded-lg gap-1.5">
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">Certificates</span>
                </TabsTrigger>
              )}
              <TabsTrigger value="badges" className="rounded-lg gap-1.5">
                <Award className="w-4 h-4" />
                <span className="hidden sm:inline">Badges</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card className="rounded-2xl border-border shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="name"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Your full name"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        value={user?.email || ""}
                        disabled
                        className="pl-10 bg-muted"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        placeholder="+66 xxx xxx xxxx"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Button variant="hero" onClick={handleSaveProfile} disabled={saving}>
                    {saving ? "Saving…" : "Save Changes"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Certificates Tab (Caregiver only) */}
            {isCaregiver && (
              <TabsContent value="certificates">
                <div className="space-y-6">
                  {/* Upload new */}
                  <Card className="rounded-2xl border-border shadow-card">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Upload className="w-5 h-5 text-primary" />
                        Upload Certificate
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Certificate Name</Label>
                          <Input
                            value={certName}
                            onChange={(e) => setCertName(e.target.value)}
                            placeholder="e.g. Nursing License"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Type</Label>
                          <select
                            value={certType}
                            onChange={(e) => setCertType(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          >
                            <option value="nursing_license">Nursing License</option>
                            <option value="cpr_certification">CPR Certification</option>
                            <option value="special_needs">Special Needs Training</option>
                            <option value="elderly_care">Elderly Care</option>
                            <option value="first_aid">First Aid</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => certInputRef.current?.click()}
                        disabled={uploading || !certName}
                        className="gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        {uploading ? "Uploading…" : "Choose File & Upload"}
                      </Button>
                      <input
                        ref={certInputRef}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={handleCertUpload}
                      />
                    </CardContent>
                  </Card>

                  {/* Existing certificates */}
                  <Card className="rounded-2xl border-border shadow-card">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        My Certificates
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {certificates.length === 0 ? (
                        <p className="text-muted-foreground text-sm py-4 text-center">
                          No certificates uploaded yet.
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {certificates.map((cert) => {
                            const sc = statusConfig[cert.status] || statusConfig.pending;
                            const StatusIcon = sc.icon;
                            return (
                              <div
                                key={cert.id}
                                className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border"
                              >
                                <div className="flex items-center gap-3">
                                  <FileText className="w-5 h-5 text-muted-foreground" />
                                  <div>
                                    <p className="font-medium text-foreground text-sm">
                                      {cert.certificate_name}
                                    </p>
                                    <p className="text-xs text-muted-foreground capitalize">
                                      {cert.certificate_type.replace(/_/g, " ")}
                                    </p>
                                  </div>
                                </div>
                                <div className={`flex items-center gap-1 text-xs font-medium ${sc.color}`}>
                                  <StatusIcon className="w-4 h-4" />
                                  {sc.label}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            )}

            {/* Badges Tab */}
            <TabsContent value="badges">
              <Card className="rounded-2xl border-border shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    Earned Badges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {rewards.length === 0 ? (
                    <p className="text-muted-foreground text-sm py-4 text-center">
                      {isCaregiver
                        ? "Upload and get your certificates verified to earn badges!"
                        : "No badges earned yet."}
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {rewards.map((r) => (
                        <div
                          key={r.id}
                          className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/50 border border-border text-center"
                        >
                          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                            <Award className="w-6 h-6 text-amber-600" />
                          </div>
                          <p className="font-medium text-foreground text-sm">{r.reward_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(r.awarded_at).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
