import { useRef, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, Shield, FileText, CheckCircle, Clock, XCircle } from "lucide-react";
import { Certificate } from "@/hooks/useDashboardData";

const statusConfig: Record<string, { icon: typeof CheckCircle; color: string; label: string }> = {
  approved: { icon: CheckCircle, color: "text-green-600", label: "Verified" },
  pending: { icon: Clock, color: "text-amber-500", label: "Pending" },
  rejected: { icon: XCircle, color: "text-destructive", label: "Rejected" },
};

type Props = {
  user: User;
  certificates: Certificate[];
  onRefresh: () => void;
};

const CertificatesTab = ({ user, certificates, onRefresh }: Props) => {
  const { toast } = useToast();
  const certInputRef = useRef<HTMLInputElement>(null);
  const [certName, setCertName] = useState("");
  const [certType, setCertType] = useState("nursing_license");
  const [uploading, setUploading] = useState(false);

  const handleCertUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !certName) return;

    setUploading(true);
    const ext = file.name.split(".").pop();
    const filePath = `${user.id}/certs/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage.from("certificates").upload(filePath, file);
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
      onRefresh();
    }
    setUploading(false);
  };

  return (
    <div className="space-y-6">
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
              <Input value={certName} onChange={(e) => setCertName(e.target.value)} placeholder="e.g. Nursing License" />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <select value={certType} onChange={(e) => setCertType(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="nursing_license">Nursing License</option>
                <option value="cpr_certification">CPR Certification</option>
                <option value="special_needs">Special Needs Training</option>
                <option value="elderly_care">Elderly Care</option>
                <option value="first_aid">First Aid</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <Button variant="outline" onClick={() => certInputRef.current?.click()} disabled={uploading || !certName} className="gap-2">
            <Upload className="w-4 h-4" />
            {uploading ? "Uploading…" : "Choose File & Upload"}
          </Button>
          <input ref={certInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleCertUpload} />
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border shadow-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            My Certificates
          </CardTitle>
        </CardHeader>
        <CardContent>
          {certificates.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4 text-center">No certificates uploaded yet.</p>
          ) : (
            <div className="space-y-3">
              {certificates.map((cert) => {
                const sc = statusConfig[cert.status] || statusConfig.pending;
                const StatusIcon = sc.icon;
                return (
                  <div key={cert.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground text-sm">{cert.certificate_name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{cert.certificate_type.replace(/_/g, " ")}</p>
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
  );
};

export default CertificatesTab;
