import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface AdminPasswordGateProps {
  onAuthenticated: () => void;
}

export function AdminPasswordGate({ onAuthenticated }: AdminPasswordGateProps) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("verify-admin", {
        body: { password },
      });
      if (error) throw error;
      if (data?.valid) {
        sessionStorage.setItem("admin_verified", "true");
        onAuthenticated();
      } else {
        toast({ title: "गलत पासवर्ड / Wrong password", variant: "destructive" });
      }
    } catch {
      toast({ title: "Verification failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6 p-8 rounded-2xl border bg-card shadow-lg">
        <div className="flex flex-col items-center gap-3">
          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="h-7 w-7 text-primary" />
          </div>
          <h1 className="font-headline text-xl font-bold">Admin Access</h1>
          <p className="text-sm text-muted-foreground text-center">Enter admin password to continue</p>
        </div>
        <Input
          type="password"
          placeholder="Password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          Unlock
        </Button>
      </form>
    </div>
  );
}
