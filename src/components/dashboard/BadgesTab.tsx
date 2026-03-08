import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";
import { Reward } from "@/hooks/useDashboardData";

type Props = {
  rewards: Reward[];
  isCaregiver: boolean;
};

const BadgesTab = ({ rewards, isCaregiver }: Props) => (
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
          {isCaregiver ? "Upload and get your certificates verified to earn badges!" : "No badges earned yet."}
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {rewards.map((r) => (
            <div key={r.id} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/50 border border-border text-center">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <Award className="w-6 h-6 text-amber-600" />
              </div>
              <p className="font-medium text-foreground text-sm">{r.reward_name}</p>
              <p className="text-xs text-muted-foreground">{new Date(r.awarded_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);

export default BadgesTab;
