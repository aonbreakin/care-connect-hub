import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { User as UserIcon, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { Profile } from "@/hooks/useDashboardData";

type Props = {
  user: User;
  profile: Profile;
  setProfile: (fn: (p: Profile) => Profile) => void;
};

const ProfileTab = ({ user, profile, setProfile }: Props) => {
  const { toast } = useToast();
  const [editName, setEditName] = useState(profile.full_name || "");
  const [editPhone, setEditPhone] = useState(profile.phone || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
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

  return (
    <Card className="rounded-2xl border-border shadow-card">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-primary" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Account Type</Label>
          <div className="px-4 py-2.5 rounded-xl bg-muted border border-border text-sm font-medium text-foreground capitalize">
            {profile.status === "caregiver" ? "🤝 Caregiver" : "👨‍👩‍👧 Member"}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input id="name" value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Your full name" className="pl-10" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input id="email" value={user.email || ""} disabled className="pl-10 bg-muted" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input id="phone" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} placeholder="+66 xxx xxx xxxx" className="pl-10" />
          </div>
        </div>
        <Button variant="hero" onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save Changes"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfileTab;
