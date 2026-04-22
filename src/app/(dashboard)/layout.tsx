
'use client';

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Search, Bell, ChevronDown, Command, Zap, ChevronRight, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { platforms } from "@/lib/mock-data";
import Link from "next/link";
import { useUser, useAuth, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = getFirestore();
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Check for Admin role
  const adminRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'roles_admin', user.uid);
  }, [user, firestore]);
  const { data: adminDoc } = useDoc(adminRef);
  const isAdmin = !!adminDoc;

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const filteredResults = platforms.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.market.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  const getSectionLabel = (path: string) => {
    if (path === "/") return "Command Center";
    if (path.startsWith("/channels")) return "Expansion Pipeline";
    if (path.startsWith("/campaigns")) return "Campaign Engine";
    if (path.startsWith("/partnerships")) return "Strategic Partnerships";
    if (path.startsWith("/tasks")) return "Operational Tasks";
    if (path.startsWith("/hub")) return "Intelligence Hub";
    if (path.startsWith("/reports")) return "Performance Intel";
    if (path.startsWith("/settings")) return "System Config";
    return "Operations";
  };

  if (isUserLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <Zap className="size-12 text-primary fill-primary" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-tier-4">Syncing Mission Profile</span>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground selection:bg-primary/20">
        <AppSidebar isAdmin={isAdmin} />
        <SidebarInset className="flex flex-col overflow-hidden bg-transparent">
          <header className="h-14 flex items-center justify-between px-6 bg-background/20 backdrop-blur-xl sticky top-0 z-40 border-b border-white/[0.02]">
            <div className="flex items-center gap-5">
              <SidebarTrigger className="text-tier-3 hover:text-primary transition-colors" />
              <div className="h-4 w-px bg-white/5 hidden sm:block" />
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-tier-3">Unit-01</span>
                <span className="text-tier-3/20 text-xs">/</span>
                <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-primary">
                  {getSectionLabel(pathname)}
                </span>
                {isAdmin && (
                  <>
                    <span className="text-tier-3/20 text-xs">/</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold uppercase tracking-widest border border-primary/20">Admin</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-5">
              <div className="flex items-center gap-4">
                <div 
                  onClick={() => setIsSearchOpen(true)}
                  className="hidden sm:flex items-center bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-1.5 gap-3 cursor-pointer hover:bg-white/[0.06] hover:border-white/20 transition-all group"
                >
                  <Search className="size-3.5 text-tier-2 group-hover:text-primary transition-colors" />
                  <span className="text-[11px] font-medium tracking-tight text-tier-1 group-hover:text-primary pr-6 transition-colors">Search Strategic Assets</span>
                  <span className="text-[9px] font-medium text-tier-2 tracking-widest bg-white/5 px-1.5 py-0.5 rounded border border-white/10">⌘K</span>
                </div>

                <div className="relative cursor-pointer text-tier-3 hover:text-primary transition-colors p-1.5">
                  <Bell className="size-4" />
                  <span className="absolute top-1.5 right-1.5 size-1.5 bg-accent rounded-full shadow-[0_0_8px_hsl(var(--accent)/0.5)]" />
                </div>
              </div>
              
              <div className="h-4 w-px bg-white/[0.05]" />
              
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-3 cursor-pointer group outline-none">
                  <div className="size-7 rounded-full overflow-hidden border border-white/[0.05] group-hover:border-accent/40 transition-all opacity-90 group-hover:opacity-100">
                    <img src={user.photoURL || "https://picsum.photos/seed/user/100/100"} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <ChevronDown className="size-3 text-tier-3 group-hover:text-primary transition-colors" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2 bg-background/95 backdrop-blur-xl border-white/[0.08] rounded-xl shadow-2xl">
                  <DropdownMenuLabel className="flex flex-col gap-0.5 py-3">
                    <span className="text-[13px] font-bold text-tier-1">{user.displayName}</span>
                    <span className="text-[10px] text-tier-3 font-medium truncate">{user.email}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/[0.05]" />
                  <DropdownMenuItem asChild className="hover:bg-white/[0.05] cursor-pointer">
                    <Link href="/settings" className="flex items-center gap-2">
                      <Zap className="size-3.5 text-primary" />
                      <span className="text-[12px] font-semibold text-tier-2">Profile Intel</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="hover:bg-rose-500/10 text-rose-400 cursor-pointer focus:text-rose-400">
                    <LogOut className="size-3.5 mr-2" />
                    <span className="text-[12px] font-semibold">Terminate Session</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-8 lg:p-10 custom-scrollbar">
            {children}
          </main>
        </SidebarInset>
      </div>

      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="sm:max-w-[550px] p-0 border-white/[0.1] bg-[#0A0A0B]/95 backdrop-blur-2xl rounded-2xl overflow-hidden shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)]">
          <DialogTitle className="sr-only">Global Search</DialogTitle>
          <DialogDescription className="sr-only">Quickly find platforms, tasks, and strategic intelligence across the operations unit.</DialogDescription>
          <div className="flex flex-col">
            <div className="flex items-center gap-3 px-4 py-4 border-b border-white/[0.05]">
              <Search className="size-5 text-primary" />
              <Input 
                autoFocus
                placeholder="Search platforms, channels, intel..." 
                className="border-0 bg-transparent focus-visible:ring-0 text-base placeholder:text-tier-3 h-auto p-0 text-tier-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-md px-2 py-0.5">
                <span className="text-[10px] font-bold text-tier-2 tracking-widest uppercase">Esc</span>
              </div>
            </div>

            <div className="p-2 flex flex-col gap-1 max-h-[350px] overflow-y-auto custom-scrollbar">
              {searchQuery.length > 0 ? (
                <>
                  <div className="px-3 pt-2 pb-1 text-[10px] font-bold text-tier-3 uppercase tracking-[0.2em]">Strategic Results</div>
                  {filteredResults.length > 0 ? (
                    filteredResults.map(p => (
                      <Link 
                        key={p.id} 
                        href={`/channels/${p.id}`}
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.04] group transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                            <Zap className="size-4" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[14px] font-semibold text-tier-1">{p.name}</span>
                            <span className="text-[11px] text-tier-2">{p.type} • {p.market}</span>
                          </div>
                        </div>
                        <ChevronRight className="size-4 text-tier-3 group-hover:text-primary transition-transform group-hover:translate-x-1" />
                      </Link>
                    ))
                  ) : (
                    <div className="p-8 flex flex-col items-center justify-center gap-3 opacity-40">
                      <Search className="size-8 text-tier-3" />
                      <span className="text-[11px] font-medium uppercase tracking-widest text-tier-3">No assets found</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-8 flex flex-col items-center justify-center gap-4 text-center">
                  <div className="size-12 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center">
                    <Command className="size-6 text-tier-3 opacity-40" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-[13px] font-medium text-tier-2">Search the Operations Unit</p>
                    <p className="text-[11px] text-tier-3">Find platforms, tasks, and strategic intel instantly.</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="px-4 py-3 bg-white/[0.02] border-t border-white/[0.05] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-tier-3 uppercase font-bold tracking-widest">Select</span>
                  <div className="bg-white/5 border border-white/10 rounded px-1.5 text-[9px] text-tier-2">⏎</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-tier-3 uppercase font-bold tracking-widest">Navigate</span>
                  <div className="bg-white/5 border border-white/10 rounded px-1.5 text-[9px] text-tier-2">↑↓</div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-tier-3 uppercase tracking-[0.15em]">Growth OS v2.5.0</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
