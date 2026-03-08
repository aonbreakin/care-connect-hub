import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, CalendarDays, Users } from "lucide-react";
import { Booking } from "@/hooks/useDashboardData";

type Props = {
  bookings: Booking[];
};

const CaregiverRevenueTab = ({ bookings }: Props) => {
  const completed = bookings.filter((b) => b.status === "completed");
  const approved = bookings.filter((b) => b.status === "approved");
  const totalRevenue = completed.reduce((sum, b) => sum + Number(b.total_price), 0);
  const pendingRevenue = approved.reduce((sum, b) => sum + Number(b.total_price), 0);
  const totalHours = completed.reduce((sum, b) => sum + Number(b.duration_hours), 0);
  const uniqueClients = new Set(completed.map((b) => b.family_id)).size;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="rounded-2xl border-border shadow-card">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Revenue</p>
              <p className="text-xl font-bold text-foreground">฿{totalRevenue.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border shadow-card">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pending</p>
              <p className="text-xl font-bold text-foreground">฿{pendingRevenue.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border shadow-card">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <CalendarDays className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Hours Worked</p>
              <p className="text-xl font-bold text-foreground">{totalHours}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border shadow-card">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Clients Served</p>
              <p className="text-xl font-bold text-foreground">{uniqueClients}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent completed */}
      <Card className="rounded-2xl border-border shadow-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            Completed Jobs
          </CardTitle>
        </CardHeader>
        <CardContent>
          {completed.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4 text-center">No completed jobs yet.</p>
          ) : (
            <div className="space-y-3">
              {completed.map((b) => (
                <div key={b.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">{new Date(b.scheduled_date).toLocaleDateString()}</p>
                    <p className="text-xs text-muted-foreground mt-1">{b.duration_hours}h</p>
                  </div>
                  <p className="font-semibold text-green-600">+฿{Number(b.total_price).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CaregiverRevenueTab;
