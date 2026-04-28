"use client";

import { useState } from "react";
import { 
  ShieldAlert, 
  Users, 
  Zap, 
  Activity, 
  Database, 
  CheckCircle2, 
  MoreHorizontal,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Trash2,
  UserPlus,
  Lock,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
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
import { useToast } from "@/hooks/use-toast";
import { StatCard } from "@/components/dashboard/StatCard";

export default function AdminConsolePage() {
  const { toast } = useToast();
  const { user: currentUser } = useUser();
  const firestore = getFirestore();

  // Admin Check (Redundant but safe for route content)
  const adminCheckRef = useMemoFirebase(() => {
    if (!currentUser) return null;
    return doc(firestore, 'roles_admin', currentUser.uid);
  }, [currentUser, firestore]);
  const { data: adminDoc } = useDoc(adminCheckRef);

  // Fetch All Users
  const usersQuery = useMemoFirebase(() => collection(firestore, 'users'), [firestore]);
  const { data: allUsers, isLoading: isUsersLoading } = useCollection(usersQuery);

  // Fetch All Admins
  const adminsQuery = useMemoFirebase(() => collection(firestore, 'roles_admin'), [firestore]);
  const { data: adminList } = useCollection(adminsQuery);

  const toggleAdminRole = (userId: string, currentIsAdmin: boolean) => {
    const roleRef = doc(firestore, 'roles_admin', userId);
    if (currentIsAdmin) {
      if (userId === currentUser?.uid) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You cannot revoke your own administrative clearance.",
        });
        return;
      }
      deleteDocumentNonBlocking(roleRef);
      toast({
        title: "Access Revoked",
        description: "User has been removed from the administrator collective.",
      });
    } else {
      setDocumentNonBlocking(roleRef, { id: userId, assignedAt: new Date().toISOString() }, { merge: true });
      toast({
        title: "Access Authorized",
        description: "User has been promoted to System Administrator.",
      });
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-10 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/[0.03]">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="size-11 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-lg active-glow">
              <ShieldAlert className="size-5.5 text-primary" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-3xl font-semibold tracking-tight text-tier-1">Admin Console</h1>
              <span className="text-[10px] font-bold text-tier-4 uppercase tracking-[0.25em] mt-1">Global System Oversight</span>
            </div>
          </div>
          <p className="text-tier-2 text-[14px] font-medium leading-relaxed max-w-xl">
            Authorize command team access, monitor system-wide data integrity, and manage global operational protocols.
          </p>
        </div>
      </header>

      {/* System Integrity Rail */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Cloud Engine" value="Stable" icon={Database} iconColor="text-emerald-400" trend="Integrity: 100%" trendUp={true} />
        <StatCard label="Active Units" value={allUsers?.length || 0} icon={Users} iconColor="text-primary" trend="Total Registry" trendUp={true} />
        <StatCard label="Admin Group" value={adminList?.length || 0} icon={Lock} iconColor="text-accent" trend="Security Level 1" trendUp={true} />
        <StatCard label="System Latency" value="12ms" icon={Activity} iconColor="text-blue-400" trend="Optimized" trendUp={true} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Command Team Management */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          <div className="premium-panel rounded-3xl overflow-hidden border border-white/[0.06] shadow-2xl">
            <div className="px-8 py-6 border-b border-white/[0.04] bg-white/[0.01] flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.25em] text-tier-1">Command Team Registry</h2>
                <span className="text-[13px] text-tier-3 font-medium">Manage operational permissions and clearance levels.</span>
              </div>
              <Button variant="ghost" className="h-9 px-4 rounded-xl border border-white/[0.05] text-[10px] font-bold uppercase tracking-wider text-tier-2 hover:text-primary transition-all">
                <UserPlus className="size-3.5 mr-2" /> Invite Unit
              </Button>
            </div>

            {isUsersLoading ? (
              <div className="p-20 flex flex-col items-center justify-center gap-4 opacity-50">
                <Loader2 className="size-8 text-primary animate-spin" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Scanning Registry...</span>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-white/[0.02] border-b border-white/[0.04]">
                  <tr>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-tier-4">Identity</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-tier-4">Clearance</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-tier-4 text-right">Operational Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {allUsers?.map((u) => {
                    const isUserAdmin = adminList?.some(a => a.id === u.id);
                    return (
                      <tr key={u.id} className="hover:bg-white/[0.01] transition-colors group">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <Avatar className="size-10 border border-white/[0.1] shadow-lg">
                              <AvatarImage src={u.photoURL} />
                              <AvatarFallback className="bg-white/5 text-[12px] font-bold">{u.displayName?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="text-[15px] font-semibold text-tier-1 tracking-tight">{u.displayName || "Unknown Unit"}</span>
                              <span className="text-[11px] text-tier-3 font-medium">{u.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex flex-col gap-2">
                            {isUserAdmin ? (
                              <Badge className="w-fit bg-primary/20 text-primary border-primary/30 font-bold text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded-lg flex items-center gap-1.5">
                                <ShieldCheck className="size-3" /> System Administrator
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="w-fit border-white/[0.1] text-tier-3 font-bold text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded-lg">
                                Tactical Operator
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => toggleAdminRole(u.id, !!isUserAdmin)}
                            className={cn(
                              "h-9 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border border-transparent",
                              isUserAdmin 
                                ? "text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20" 
                                : "text-primary hover:bg-primary/10 hover:border-primary/20"
                            )}
                          >
                            {isUserAdmin ? "Revoke Access" : "Promote to Admin"}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* System Intelligence */}
        <div className="xl:col-span-4 flex flex-col gap-8">
          <div className="premium-panel p-8 rounded-3xl flex flex-col gap-6 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-tier-1">System Health</h3>
              <Activity className="size-4 text-primary" />
            </div>
            <div className="space-y-5">
              <HealthItem label="Realtime Auth" status="online" />
              <HealthItem label="Cloud Firestore" status="online" />
              <HealthItem label="Storage Engine" status="pending" />
              <HealthItem label="AI Inference" status="online" />
            </div>
            <Separator className="bg-white/[0.05]" />
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-tier-4">Current Version</span>
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-tier-2">Growth OS v2.6.0-B</span>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[8px] uppercase font-bold">Stable Release</Badge>
              </div>
            </div>
          </div>

          <div className="premium-panel p-8 rounded-3xl flex flex-col gap-5 border-amber-500/20 bg-amber-500/5">
            <div className="flex items-center gap-3">
              <AlertCircle className="size-5 text-amber-500" />
              <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-amber-500">Security Warning</h3>
            </div>
            <p className="text-[13px] text-tier-2 leading-relaxed font-medium">
              Administrative actions are logged and synchronized across the cloud registry. Promotional changes to Clearance Levels affect all operational zones immediately.
            </p>
            <Button variant="outline" className="h-10 rounded-xl border-amber-500/20 bg-amber-500/5 text-amber-500 text-[10px] font-bold uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-all">
              View Access Logs
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function HealthItem({ label, status }: { label: string, status: 'online' | 'pending' | 'offline' }) {
  return (
    <div className="flex items-center justify-between group">
      <span className="text-[13px] font-medium text-tier-3 group-hover:text-tier-1 transition-colors">{label}</span>
      <div className="flex items-center gap-2">
        <span className={cn(
          "size-1.5 rounded-full",
          status === 'online' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : 
          status === 'pending' ? "bg-amber-500 animate-pulse" : "bg-rose-500"
        )} />
        <span className={cn(
          "text-[10px] font-bold uppercase tracking-widest",
          status === 'online' ? "text-emerald-500" : 
          status === 'pending' ? "text-amber-500" : "text-rose-500"
        )}>{status}</span>
      </div>
    </div>
  );
}
