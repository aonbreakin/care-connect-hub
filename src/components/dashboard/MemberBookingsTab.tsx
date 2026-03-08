import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Booking } from "@/hooks/useDashboardData";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: "bg-amber-100", text: "text-amber-800", label: "Pending" },
  approved: { bg: "bg-green-100", text: "text-green-800", label: "Approved" },
  rejected: { bg: "bg-red-100", text: "text-red-800", label: "Rejected" },
  completed: { bg: "bg-blue-100", text: "text-blue-800", label: "Completed" },
};

type Props = {
  bookings: Booking[];
};

const MemberBookingsTab = ({ bookings }: Props) => {
  const [caregiverNames, setCaregiverNames] = useState<Record<string, string>>({});

  useEffect(() => {
    const ids = [...new Set(bookings.map((b) => b.caregiver_id))];
    if (ids.length === 0) return;
    supabase
      .from("profiles")
      .select("user_id, full_name")
      .in("user_id", ids)
      .then(({ data }) => {
        if (data) {
          const map: Record<string, string> = {};
          data.forEach((p) => (map[p.user_id] = p.full_name || "Caregiver"));
          setCaregiverNames(map);
        }
      });
  }, [bookings]);

  const upcoming = bookings.filter((b) => b.status === "approved" && new Date(b.scheduled_date) >= new Date());
  const all = bookings;

  return (
    <div className="space-y-6">
      {/* Upcoming schedule */}
      <Card className="rounded-2xl border-border shadow-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-primary" />
            Upcoming Schedule
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
                    <p className="font-medium text-foreground text-sm">{caregiverNames[b.caregiver_id] || "Caregiver"}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <CalendarDays className="w-3 h-3" />
                      {new Date(b.scheduled_date).toLocaleDateString()} at {b.scheduled_time?.slice(0, 5)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">฿{Number(b.total_price).toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{b.duration_hours}h</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* All bookings */}
      <Card className="rounded-2xl border-border shadow-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            All Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {all.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4 text-center">No bookings yet. Browse caregivers to book your first service!</p>
          ) : (
            <div className="space-y-3">
              {all.map((b) => {
                const s = statusStyles[b.status] || statusStyles.pending;
                return (
                  <div key={b.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border">
                    <div>
                      <p className="font-medium text-foreground text-sm">{caregiverNames[b.caregiver_id] || "Caregiver"}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(b.scheduled_date).toLocaleDateString()} · {b.duration_hours}h
                      </p>
                    </div>
                    <Badge className={`${s.bg} ${s.text} border-none`}>{s.label}</Badge>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberBookingsTab;
