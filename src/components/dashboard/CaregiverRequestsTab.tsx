import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Inbox, CalendarDays, CheckCircle, XCircle } from "lucide-react";
import { Booking } from "@/hooks/useDashboardData";

type Props = {
  bookings: Booking[];
  onRefresh: () => void;
};

const CaregiverRequestsTab = ({ bookings, onRefresh }: Props) => {
  const { toast } = useToast();
  const [familyNames, setFamilyNames] = useState<Record<string, string>>({});
  const [updating, setUpdating] = useState<string | null>(null);

  const pending = bookings.filter((b) => b.status === "pending");
  const upcoming = bookings.filter((b) => b.status === "approved" && new Date(b.scheduled_date) >= new Date());

  useEffect(() => {
    const ids = [...new Set(bookings.map((b) => b.family_id))];
    if (ids.length === 0) return;
    supabase
      .from("profiles")
      .select("user_id, full_name")
      .in("user_id", ids)
      .then(({ data }) => {
        if (data) {
          const map: Record<string, string> = {};
          data.forEach((p) => (map[p.user_id] = p.full_name || "Family"));
          setFamilyNames(map);
        }
      });
  }, [bookings]);

  const handleAction = async (id: string, status: "approved" | "rejected") => {
    setUpdating(id);
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: status === "approved" ? "Request approved!" : "Request rejected." });
      onRefresh();
    }
    setUpdating(null);
  };

  return (
    <div className="space-y-6">
      {/* Pending requests */}
      <Card className="rounded-2xl border-border shadow-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Inbox className="w-5 h-5 text-primary" />
            Pending Requests
            {pending.length > 0 && (
              <Badge className="bg-amber-100 text-amber-800 border-amber-200 ml-2">{pending.length}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pending.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4 text-center">No pending requests.</p>
          ) : (
            <div className="space-y-3">
              {pending.map((b) => (
                <div key={b.id} className="p-4 rounded-xl bg-muted/50 border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground text-sm">{familyNames[b.family_id] || "Family"}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <CalendarDays className="w-3 h-3" />
                        {new Date(b.scheduled_date).toLocaleDateString()} at {b.scheduled_time?.slice(0, 5)} · {b.duration_hours}h
                      </p>
                      {b.notes && <p className="text-xs text-muted-foreground mt-1 italic">"{b.notes}"</p>}
                    </div>
                    <p className="text-sm font-semibold text-foreground">฿{Number(b.total_price).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="gap-1 bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handleAction(b.id, "approved")}
                      disabled={updating === b.id}
                    >
                      <CheckCircle className="w-4 h-4" /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 text-destructive border-destructive/30 hover:bg-destructive/10"
                      onClick={() => handleAction(b.id, "rejected")}
                      disabled={updating === b.id}
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming schedule */}
      <Card className="rounded-2xl border-border shadow-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-primary" />
            My Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcoming.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4 text-center">No upcoming appointments.</p>
          ) : (
            <div className="space-y-3">
              {upcoming.map((b) => (
                <div key={b.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border">
                  <div>
                    <p className="font-medium text-foreground text-sm">{familyNames[b.family_id] || "Family"}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(b.scheduled_date).toLocaleDateString()} at {b.scheduled_time?.slice(0, 5)} · {b.duration_hours}h
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-foreground">฿{Number(b.total_price).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CaregiverRequestsTab;
