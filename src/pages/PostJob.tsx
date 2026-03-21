import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, CalendarDays, Clock, DollarSign } from "lucide-react";
import { useEffect } from "react";

const serviceCategories = [
  "Special-Needs Training",
  "Elderly Care",
  "Busy Household Support",
];

const PostJob = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    category: "",
    date: "",
    time: "",
    duration: "2",
    budget: "",
    notes: "",
  });

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    // For now we create a booking with a placeholder caregiver_id (system will match)
    const { error } = await supabase.from("bookings").insert({
      family_id: user.id,
      caregiver_id: user.id, // placeholder — will be matched by caregiver accepting
      scheduled_date: form.date,
      scheduled_time: form.time,
      duration_hours: Number(form.duration),
      total_price: Number(form.budget) || 0,
      notes: `[${form.category}] ${form.notes}`,
      status: "pending",
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Job posted!", description: "Caregivers will see your request." });
      navigate("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-lg">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="rounded-2xl border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  Post a Job
                </CardTitle>
                <p className="text-sm text-muted-foreground">Describe what you need and caregivers will respond.</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Service Category</Label>
                    <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceCategories.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <div className="relative">
                        <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="pl-10" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Time</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="pl-10" required />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Duration (hours)</Label>
                      <Input type="number" min="1" max="12" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Budget (฿)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} placeholder="e.g. 2000" className="pl-10" required />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Additional Notes</Label>
                    <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Describe your needs, special requirements, etc." rows={3} />
                  </div>

                  <Button type="submit" variant="hero" className="w-full" disabled={loading || !form.category}>
                    {loading ? "Posting…" : "Post Job"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PostJob;
