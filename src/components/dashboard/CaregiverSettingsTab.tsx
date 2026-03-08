import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Settings, DollarSign } from "lucide-react";
import { CaregiverProfile } from "@/hooks/useDashboardData";

type Props = {
  user: User;
  caregiverProfile: CaregiverProfile;
  setCaregiverProfile: (fn: (p: CaregiverProfile) => CaregiverProfile) => void;
  onRefresh: () => void;
};

const CaregiverSettingsTab = ({ user, caregiverProfile, setCaregiverProfile, onRefresh }: Props) => {
  const { toast } = useToast();
  const [rate, setRate] = useState(String(caregiverProfile.hourly_rate || ""));
  const [bio, setBio] = useState(caregiverProfile.bio || "");
  const [available, setAvailable] = useState(caregiverProfile.available);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const payload = { hourly_rate: parseFloat(rate) || 0, bio, available };

    // Try update first, then insert if not exists
    const { data: existing } = await supabase
      .from("caregiver_profiles")
      .select("id")
      .eq("user_id", user.id)
      .single();

    let error;
    if (existing) {
      ({ error } = await supabase.from("caregiver_profiles").update(payload).eq("user_id", user.id));
    } else {
      ({ error } = await supabase.from("caregiver_profiles").insert({ user_id: user.id, ...payload }));
    }

    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } else {
      setCaregiverProfile((p) => ({ ...p, ...payload }));
      toast({ title: "Settings saved!" });
      onRefresh();
    }
    setSaving(false);
  };

  return (
    <Card className="rounded-2xl border-border shadow-card">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" />
          Service Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Hourly Rate (฿)</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input type="number" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="500" className="pl-10" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Bio / Description</Label>
          <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell families about your experience and specialties..." rows={4} />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label>Available for Booking</Label>
            <p className="text-xs text-muted-foreground">Toggle off when you're not accepting new clients</p>
          </div>
          <Switch checked={available} onCheckedChange={setAvailable} />
        </div>
        <Button variant="hero" onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save Settings"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CaregiverSettingsTab;
