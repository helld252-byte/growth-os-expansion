
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
  AlertCircle,
  Users,
  ShieldAlert,
  MoreHorizontal,
  Trash2,
  UserPlus,
  Edit3,
  Settings2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { 
  useUser, 
  useDoc, 
  useMemoFirebase, 
  useCollection,
  setDocumentNonBlocking,
  deleteDocumentNonBlocking 
} from "@/firebase";
import { doc, getFirestore, collection } from "firebase/firestore";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { toast } = useToast();
  const { user: currentUser, isUserLoading } = useUser();
  const firestore = getFirestore();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "Growth Operations Lead",
    zone: "Global (EU/US/APAC)"
  });

  // 1. Check if Current User is Admin
  const adminCheckRef = useMemoFirebase(() => {
    if (!currentUser) return null;
    return doc(firestore, 'roles_admin', currentUser.uid);
  }, [currentUser, firestore]);
  const { data: adminDoc } = useDoc(adminCheckRef);
  const isAdmin = !!adminDoc;

  // 2. Fetch All Users (Admin Only)
  const usersQuery = useMemoFirebase(() => {
    if (!isAdmin) return null;
    return collection(firestore, 'users');
  }, [isAdmin, firestore]);
  const { data: allUsers, isLoading: isUsersLoading } = useCollection(usersQuery);

  // 3. Fetch All Admins (Admin Only)
  const adminsQuery = useMemoFirebase(() => {
    if (!isAdmin) return null;
    return collection(firestore, 'roles_admin');
  }, [isAdmin, firestore]);
  const { data: adminList } = useCollection(adminsQuery);

  useEffect(() => {
    if (currentUser) {
      setProfile(prev => ({
        ...prev,
        name: currentUser.displayName || "",
        email: currentUser.email || "",
      }));
    }
  }, [currentUser]);

  const handleUpdateProfile = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      setIsEditingProfile(false);
      toast({
        title: "Protocol Updated",
        description: "Strategic profile identity has been synchronized across Unit-01.",
      });
    }, 1200);
  };

  const toggleAdminRole = (userId: string, currentIsAdmin: boolean) => {
    const roleRef = doc(firestore, 'roles_admin', userId);
    if (currentIsAdmin) {
      if (userId === currentUser?.uid) {
        toast({
          variant: "destructive",
          title: "Operation Denied",
          description: "You cannot remove your own administrative privileges.",
        });
        return;
      }
      deleteDocumentNonBlocking(roleRef);
      toast({
        title: "Access Revoked",
        description: "User has been removed from the Admin collective.",
      });
    } else {
      setDocumentNonBlocking(roleRef, { id: userId, assignedAt: new Date().toISOString() }, { merge: true });
      toast({
        title: "Access Granted",
        description: "User has been promoted to System Administrator.",
      });
    }
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
          {isAdmin && (
            <TabsTrigger value="team" className="rounded-lg px-6 text-[12px] font-semibold uppercase tracking-wider data-[state=active]:bg-primary/20 data-[state=active]:text-tier-1">
              <Users className="size-4 mr-2" /> Command Team
            </TabsTrigger>
          )}
          <TabsTrigger value="workspace" className="rounded-lg px-6 text-[12px] font-semibold uppercase tracking-wider data-[state=active]:bg-primary/20 data-[state=active]:text-tier-1">
            <Building2 className="size-4 mr-2" /> Workspace
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg px-6 text-[12px] font-semibold uppercase tracking-wider data-[state=active]:bg-primary/20 data-[state=active]:text-tier-1">
            <Bell className="size-4 mr-2" /> Alerts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-0 space-y-8 animate-in slide-in-from-bottom-2 duration-500">
          <div className="premium-panel p-8 rounded-2xl flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <Avatar className="size-24 border-2 border-white/[0.08] group-hover:border-primary/50 transition-all shadow-2xl">
                    <AvatarImage src={currentUser?.photoURL || "https://picsum.photos/seed/user/200/200"} />
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
                  <p className="text-tier-3 text-[14px]">{isAdmin ? "System Administrator" : profile.role} • Unit-01</p>
                  <div className="flex gap-2 mt-1">
                    {isAdmin && (
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px] px-3 py-0.5 uppercase tracking-wider font-medium">Administrator</Badge>
                    )}
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] px-3 py-0.5 uppercase tracking-wider font-medium">Verified Account</Badge>
                  </div>
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-10 rounded-xl border border-white/[0.05] text-tier-3 hover:text-primary transition-all">
                    <MoreHorizontal className="size-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur-xl border-white/[0.08] rounded-xl">
                  <DropdownMenuItem onClick={() => setIsEditingProfile(!isEditingProfile)} className="flex items-center gap-2.5 py-2.5 cursor-pointer">
                    <Edit3 className="size-4 text-primary" />
                    <span className="text-[12px] font-semibold text-tier-2">{isEditingProfile ? "Cancel Editing" : "Edit Strategic Profile"}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2.5 py-2.5 cursor-pointer">
                    <Settings2 className="size-4 text-tier-3" />
                    <span className="text-[12px] font-semibold text-tier-2">System Preferences</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {isEditingProfile && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-8">
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
            )}
          </div>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="team" className="mt-0 space-y-8 animate-in slide-in-from-bottom-2 duration-500">
            <div className="premium-panel p-8 rounded-2xl flex flex-col gap-8">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-semibold text-tier-1">Command Team</h3>
                  <p className="text-tier-2 text-[14px]">Manage user profiles and strategic access levels within Unit-01.</p>
                </div>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-3 py-1 font-bold text-[10px] uppercase tracking-widest">
                  {allUsers?.length || 0} Registered Units
                </Badge>
              </div>

              <div className="flex flex-col gap-4">
                {isUsersLoading ? (
                  <div className="p-12 flex flex-col items-center justify-center gap-4 opacity-40">
                    <Zap className="size-8 text-primary animate-pulse" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.25em]">Scanning Database...</span>
                  </div>
                ) : (
                  <div className="border border-white/[0.05] rounded-xl overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-white/[0.02] border-b border-white/[0.05]">
                        <tr>
                          <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-tier-4">Identity</th>
                          <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-tier-4">Status</th>
                          <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-tier-4">Strategic Role</th>
                          <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-tier-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.03]">
                        {allUsers?.map((u) => {
                          const isUserAdmin = adminList?.some(a => a.id === u.id);
                          return (
                            <tr key={u.id} className="hover:bg-white/[0.01] transition-colors group">
                              <td className="px-6 py-5">
                                <div className="flex items-center gap-4">
                                  <Avatar className="size-9 border border-white/[0.1]">
                                    <AvatarImage src={u.photoURL} />
                                    <AvatarFallback className="bg-white/5 text-[12px] font-bold">
                                      {u.displayName?.charAt(0) || u.email?.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex flex-col">
                                    <span className="text-[14px] font-semibold text-tier-1">{u.displayName || "Unknown Unit"}</span>
                                    <span className="text-[11px] text-tier-3">{u.email}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-5">
                                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[9px] uppercase tracking-wider font-bold">
                                  Active
                                </Badge>
                              </td>
                              <td className="px-6 py-5">
                                {isUserAdmin ? (
                                  <div className="flex items-center gap-2 text-primary">
                                    <ShieldAlert className="size-3.5" />
                                    <span className="text-[11px] font-bold uppercase tracking-widest">Administrator</span>
                                  </div>
                                ) : (
                                  <span className="text-[11px] text-tier-3 font-medium uppercase tracking-widest">Operator</span>
                                )}
                              </td>
                              <td className="px-6 py-5 text-right">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => toggleAdminRole(u.id, !!isUserAdmin)}
                                  className={cn(
                                    "h-8 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                                    isUserAdmin 
                                      ? "text-rose-400 hover:bg-rose-500/10 hover:text-rose-300" 
                                      : "text-primary hover:bg-primary/10"
                                  )}
                                >
                                  {isUserAdmin ? "Revoke Admin" : "Grant Admin"}
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        )}

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
