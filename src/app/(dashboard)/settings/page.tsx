
"use client";

import { useState, useEffect } from "react";
import { 
  User, 
  Building2, 
  Bell, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Mail, 
  Key, 
  Cloud,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useUser, useDoc, useMemoFirebase } from "@/firebase";
import { doc, getFirestore } from "firebase/firestore";

export default function SettingsPage() {
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const firestore = getFirestore();
  const [isUpdating, setIsUpdating] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "Growth Operations Lead", // Default if not in metadata
    zone: "Global (EU/US/APAC)"
  });

  // Check for Admin role to display status
  const adminRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'roles_admin', user.uid);
  }, [user, firestore]);
  const { data: adminDoc } = useDoc(adminRef);
  const isAdmin = !!adminDoc;

  useEffect(() => {
    if (user) {
      setProfile(prev => ({
        ...prev,
        name: user.displayName || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleUpdateProfile = () => {
    setIsUpdating(true);
    
    // Simulate tactical sync
    setTimeout(() => {
      setIsUpdating(false);
      toast({
        title: "Protocol Updated",
        description: "Strategic profile identity has been synchronized across Unit-01.",
      });
    }, 1200);
  };

  if (isUserLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <Zap className="size-8 text-primary animate-pulse" />
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-tier-3">Syncing System Config...</span>
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto flex flex-col gap-10 animate-in fade-in duration-700">
      <header className="flex flex-col gap-3 pb-8 border-b border-white/[0.04]">
        <h1 className="text-3xl font-semibold tracking-tight text-tier-1">System Config</h1>
        <p className="text-tier-2 text-[15px] font-medium leading-relaxed max-w-2xl">
          Manage your strategic workspace identity, operational notifications, and market integration protocols.
        </p>
      </header>

      <Tabs defaultValue="profile" className="flex flex-col gap-8">
        <TabsList className="bg-white/[0.02] border border-white/[0.06] p-1 h-11 w-fit rounded-xl">
          <TabsTrigger value="profile" className="rounded-lg px-6 text-[12px] font-semibold uppercase tracking-wider data-[state=active]:bg-primary/20 data-[state=active]:text-tier-1">
            <User className="size-4 mr-2" /> Profile
          </TabsTrigger>
          <TabsTrigger value="workspace" className="rounded-lg px-6 text-[12px] font-semibold uppercase tracking-wider data-[state=active]:bg-primary/20 data-[state=active]:text-tier-1">
            <Building2 className="size-4 mr-2" /> Workspace
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg px-6 text-[12px] font-semibold uppercase tracking-wider data-[state=active]:bg-primary/20 data-[state=active]:text-tier-1">
            <Bell className="size-4 mr-2" /> Alerts
          </TabsTrigger>
          <TabsTrigger value="integrations" className="rounded-lg px-6 text-[12px] font-semibold uppercase tracking-wider data-[state=active]:bg-primary/20 data-[state=active]:text-tier-1">
            <Zap className="size-4 mr-2" /> Integrations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-0 space-y-8 animate-in slide-in-from-bottom-2 duration-500">
          <div className="premium-panel p-8 rounded-2xl flex flex-col gap-8">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <Avatar className="size-24 border-2 border-white/[0.08] group-hover:border-primary/50 transition-all shadow-2xl">
                  <AvatarImage src={user?.photoURL || "https://picsum.photos/seed/user/200/200"} />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                    {profile.name ? profile.name.split(' ').map(n => n[0]).join('') : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity">
                  <Cloud className="size-6 text-white" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-semibold text-tier-1">{profile.name || "Unknown Identity"}</h3>
                <p className="text-tier-3 text-[14px]">{profile.role} • Unit-01</p>
                <div className="flex gap-2 mt-1">
                  {isAdmin && (
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px] px-3 py-0.5 uppercase tracking-wider font-medium">Administrator</Badge>
                  )}
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] px-3 py-0.5 uppercase tracking-wider font-medium">Verified Account</Badge>
                </div>
              </div>
            </div>

            <Separator className="bg-white/[0.04]" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-3">
                <Label className="text-[11px] uppercase tracking-[0.2em] text-tier-4 font-bold ml-1">Full Identity</Label>
                <Input 
                  value={profile.name} 
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  className="bg-white/[0.02] border-white/[0.06] h-12 px-5 text-tier-1 font-medium rounded-xl focus-visible:ring-primary/20" 
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label className="text-[11px] uppercase tracking-[0.2em] text-tier-4 font-bold ml-1">Secure Email</Label>
                <Input 
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  className="bg-white/[0.02] border-white/[0.06] h-12 px-5 text-tier-1 font-medium rounded-xl focus-visible:ring-primary/20" 
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label className="text-[11px] uppercase tracking-[0.2em] text-tier-4 font-bold ml-1">System Role</Label>
                <Input 
                  value={isAdmin ? "System Administrator" : profile.role} 
                  disabled
                  className="bg-white/[0.02] border-white/[0.06] h-12 px-5 text-tier-1 font-medium rounded-xl focus-visible:ring-primary/20 opacity-50 cursor-not-allowed" 
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label className="text-[11px] uppercase tracking-[0.2em] text-tier-4 font-bold ml-1">Market Zone</Label>
                <Input 
                  value={profile.zone}
                  onChange={(e) => setProfile({...profile, zone: e.target.value})}
                  className="bg-white/[0.02] border-white/[0.06] h-12 px-5 text-tier-1 font-medium rounded-xl focus-visible:ring-primary/20" 
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                onClick={handleUpdateProfile}
                disabled={isUpdating}
                className="bg-primary hover:bg-primary/90 text-white font-bold h-11 px-8 rounded-xl transition-all shadow-xl shadow-primary/10 min-w-[160px]"
              >
                {isUpdating ? "Synchronizing..." : "Update Profile"}
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="workspace" className="mt-0 space-y-8 animate-in slide-in-from-bottom-2 duration-500">
          <div className="premium-panel p-8 rounded-2xl flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-semibold text-tier-1">Strategic Workspace</h3>
              <p className="text-tier-2 text-[14px]">Configure core company parameters and expansion goals.</p>
            </div>

            <div className="space-y-6 mt-2">
              <div className="flex items-center justify-between p-6 bg-white/[0.015] border border-white/[0.04] rounded-2xl hover:border-primary/20 transition-all">
                <div className="flex items-center gap-5">
                  <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Globe className="size-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[15px] font-semibold text-tier-1">Global Market Expansion</span>
                    <span className="text-[12px] text-tier-3">Enable tracking for new international retail zones.</span>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-6 bg-white/[0.015] border border-white/[0.04] rounded-2xl hover:border-primary/20 transition-all">
                <div className="flex items-center gap-5">
                  <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <ShieldCheck className="size-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[15px] font-semibold text-tier-1">Compliance Audit Mode</span>
                    <span className="text-[12px] text-tier-3">Enforce mandatory documentation for all new channel applications.</span>
                  </div>
                </div>
                <Switch />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="mt-0 space-y-8 animate-in slide-in-from-bottom-2 duration-500">
          <div className="premium-panel p-8 rounded-2xl flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-semibold text-tier-1">Operational Alerts</h3>
              <p className="text-tier-2 text-[14px]">Define how you receive tactical updates and system status reports.</p>
            </div>

            <div className="space-y-4">
              <AlertToggle 
                title="Platform Blocker Alerts" 
                desc="Instant notification when an expansion platform is flagged as 'Blocked'." 
                defaultEnabled={true} 
              />
              <AlertToggle 
                title="Weekly Mission Summary" 
                desc="Every Monday, receive an AI-generated report of all pipeline progress." 
                defaultEnabled={true} 
              />
              <AlertToggle 
                title="Task Execution Deadlines" 
                desc="Notifications for operational tasks approaching their due date." 
                defaultEnabled={false} 
              />
              <AlertToggle 
                title="Direct Outreach Responses" 
                desc="Alerts when a contact person responds to a drafted outreach email." 
                defaultEnabled={true} 
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="mt-0 space-y-8 animate-in slide-in-from-bottom-2 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <IntegrationCard 
              name="Amazon Strategic Hub" 
              status="connected" 
              desc="Automatic synchronization of sales metrics and catalog health."
            />
            <IntegrationCard 
              name="Shopify Global" 
              status="connected" 
              desc="Real-time order flow and inventory tracking across all regions."
            />
            <IntegrationCard 
              name="Salesforce CRM" 
              status="disconnected" 
              desc="Connect leads and distributors to your central strategic CRM."
            />
            <IntegrationCard 
              name="Stripe Operations" 
              status="error" 
              desc="Financial tracking and payout reconciliation for wholesale."
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AlertToggle({ title, desc, defaultEnabled }: any) {
  return (
    <div className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.015] border border-white/[0.04] group hover:border-white/10 transition-all">
      <div className="flex flex-col gap-1">
        <span className="text-[15px] font-semibold text-tier-1">{title}</span>
        <span className="text-[13px] text-tier-3">{desc}</span>
      </div>
      <Switch defaultChecked={defaultEnabled} />
    </div>
  );
}

function IntegrationCard({ name, status, desc }: any) {
  return (
    <div className="premium-panel p-6 rounded-2xl flex flex-col gap-5 group hover:border-primary/30 transition-all">
      <div className="flex items-center justify-between">
        <div className="size-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
          <Zap className="size-5 text-tier-3 group-hover:text-primary transition-colors" />
        </div>
        {status === 'connected' ? (
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] uppercase font-medium px-2.5">Active</Badge>
        ) : status === 'error' ? (
          <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/20 text-[10px] uppercase font-medium px-2.5">Error</Badge>
        ) : (
          <Badge className="bg-white/5 text-tier-3 border-white/10 text-[10px] uppercase font-medium px-2.5">Offline</Badge>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <h4 className="text-[16px] font-semibold text-tier-1">{name}</h4>
        <p className="text-[13px] text-tier-3 leading-relaxed">{desc}</p>
      </div>
      <div className="mt-2">
        {status === 'connected' ? (
          <Button variant="ghost" className="w-full h-10 rounded-xl text-tier-3 hover:text-rose-400 hover:bg-rose-500/10 text-[12px] font-semibold uppercase tracking-wider">Disconnect</Button>
        ) : (
          <Button className="w-full h-10 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all text-[12px] font-semibold uppercase tracking-wider">Connect Unit</Button>
        )}
      </div>
    </div>
  );
}
