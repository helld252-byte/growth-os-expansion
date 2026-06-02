
"use client";

import { useState, useMemo } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  DollarSign, 
  ShoppingCart, 
  Percent, 
  CreditCard, 
  Plus, 
  Filter, 
  AlertCircle,
  Loader2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  LayoutGrid,
  ShieldCheck,
  Building2,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { useCollection, useMemoFirebase, addDocumentNonBlocking } from "@/firebase";
import { collection, getFirestore, serverTimestamp } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/dashboard/StatCard";

const MONTHS = [
  { label: "January 2026", value: "2026-01" },
  { label: "February 2026", value: "2026-02" },
  { label: "March 2026", value: "2026-03" },
  { label: "April 2026", value: "2026-04" },
];

const PLATFORMS = ["Sipahh.com", "TikTok Shop", "eBay SipahhUS", "Amazon SipahhUS"];

const EXPENSE_CATEGORIES = [
  "Marketing: Ad Spend",
  "Marketing: UGC",
  "Logistics: Product Purchase",
  "Logistics: Shipping",
  "Logistics: Storage",
  "Operations: Platform Fees",
  "Operations: Tech & Fees",
  "Other"
];

export default function FinancialIntelligencePage() {
  const firestore = getFirestore();
  const [selectedMonth, setSelectedMonth] = useState("2026-01");
  const [isSalesModalOpen, setIsSalesModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  // Firestore Collections
  const salesRef = useMemoFirebase(() => collection(firestore, 'monthly_sales'), [firestore]);
  const expensesRef = useMemoFirebase(() => collection(firestore, 'expenses'), [firestore]);

  const { data: allSales, isLoading: isSalesLoading } = useCollection(salesRef);
  const { data: allExpenses, isLoading: isExpensesLoading } = useCollection(expensesRef);

  // Filtered Data
  const monthlySales = useMemo(() => 
    (allSales || []).filter(s => s.month === selectedMonth), 
  [allSales, selectedMonth]);

  const monthlyExpenses = useMemo(() => 
    (allExpenses || []).filter(e => e.date.startsWith(selectedMonth)), 
  [allExpenses, selectedMonth]);

  // Previous Month Data for Comparison
  const prevMonth = useMemo(() => {
    const [y, m] = selectedMonth.split('-').map(Number);
    const date = new Date(y, m - 2);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }, [selectedMonth]);

  const prevMonthSales = useMemo(() => 
    (allSales || []).filter(s => s.month === prevMonth), 
  [allSales, prevMonth]);

  const prevMonthExpenses = useMemo(() => 
    (allExpenses || []).filter(e => e.date.startsWith(prevMonth)), 
  [allExpenses, prevMonth]);

  // Aggregated Metrics
  const metrics = useMemo(() => {
    const totalRev = monthlySales.reduce((acc, s) => acc + (s.grossSales || 0) - (s.discounts || 0) - (s.refunds || 0), 0);
    const totalExp = monthlyExpenses.reduce((acc, e) => acc + (e.amount || 0), 0);
    const netResult = totalRev - totalExp;
    const totalOrders = monthlySales.reduce((acc, s) => acc + (s.orders || 0), 0);
    const aov = totalOrders > 0 ? totalRev / totalOrders : 0;

    const prevRev = prevMonthSales.reduce((acc, s) => acc + (s.grossSales || 0) - (s.discounts || 0) - (s.refunds || 0), 0);
    const prevExp = prevMonthExpenses.reduce((acc, e) => acc + (e.amount || 0), 0);
    const prevNet = prevRev - prevExp;

    const bestPlatform = [...monthlySales].sort((a, b) => 
      ((b.grossSales || 0) - (b.discounts || 0) - (b.refunds || 0)) - 
      ((a.grossSales || 0) - (a.discounts || 0) - (a.refunds || 0))
    )[0]?.platform || "N/A";

    const expenseByCategory = EXPENSE_CATEGORIES.reduce((acc, cat) => {
      acc[cat] = monthlyExpenses.filter(e => e.category === cat).reduce((sum, e) => sum + (e.amount || 0), 0);
      return acc;
    }, {} as Record<string, number>);

    const biggestExpense = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1])[0];

    return {
      totalRev,
      totalExp,
      netResult,
      totalOrders,
      aov,
      bestPlatform,
      biggestExpenseCategory: biggestExpense?.[1] > 0 ? biggestExpense[0] : "N/A",
      isProfitable: netResult > 0,
      isImproving: netResult > prevNet,
      expenseByCategory
    };
  }, [monthlySales, monthlyExpenses, prevMonthSales, prevMonthExpenses]);

  // Data Entry State
  const [newSales, setNewSales] = useState({
    month: "2026-01",
    platform: PLATFORMS[0],
    orders: 0,
    grossSales: 0,
    discounts: 0,
    refunds: 0
  });

  const [newExpense, setNewExpense] = useState({
    date: new Date().toISOString().split('T')[0],
    description: "",
    amount: 0,
    category: EXPENSE_CATEGORIES[0],
    platform: ""
  });

  const handleAddSales = () => {
    addDocumentNonBlocking(salesRef, {
      ...newSales,
      orders: Number(newSales.orders),
      grossSales: Number(newSales.grossSales),
      discounts: Number(newSales.discounts),
      refunds: Number(newSales.refunds),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    setIsSalesModalOpen(false);
  };

  const handleAddExpense = () => {
    addDocumentNonBlocking(expensesRef, {
      ...newExpense,
      amount: Number(newExpense.amount),
      createdAt: serverTimestamp()
    });
    setIsExpenseModalOpen(false);
  };

  if (isSalesLoading || isExpensesLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="size-10 text-primary animate-spin" />
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-tier-3">Syncing Cloud Intelligence...</span>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-10 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/[0.03]">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="size-11 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-lg active-glow">
              <BarChart3 className="size-5.5 text-primary" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-3xl font-semibold tracking-tight text-tier-1">Financial Intelligence</h1>
              <span className="text-[10px] font-bold text-tier-4 uppercase tracking-[0.25em] mt-1">Executive Performance Ledger</span>
            </div>
          </div>
          <p className="text-tier-2 text-[14px] font-medium leading-relaxed max-w-xl">
            Real-time financial orientation for decision-makers. Tracking multi-channel profitability and capital efficiency.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[200px] bg-white/[0.02] border-white/[0.08] h-11 rounded-xl text-[12px] font-bold uppercase tracking-widest text-tier-2">
              <Calendar className="size-3.5 mr-2 text-primary" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover/95 backdrop-blur-xl border-white/[0.1]">
              {MONTHS.map(m => (
                <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog open={isSalesModalOpen} onOpenChange={setIsSalesModalOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" className="h-11 px-4 rounded-xl border border-white/[0.05] text-[10px] font-bold uppercase tracking-wider text-tier-2 hover:text-primary">
                <LayoutGrid className="size-3.5 mr-2" /> Sync Sales
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-background/95 backdrop-blur-2xl border-white/[0.1] rounded-2xl sm:max-w-[500px]">
              <DialogHeader><DialogTitle className="text-xl font-bold tracking-tight text-tier-1">Log Platform Sales</DialogTitle></DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2"><Label className="text-[10px] uppercase tracking-widest text-tier-3">Month</Label><Select value={newSales.month} onValueChange={(v) => setNewSales({...newSales, month: v})}><SelectTrigger className="bg-white/[0.03] border-white/[0.08] h-12 rounded-xl text-tier-1"><SelectValue /></SelectTrigger><SelectContent>{MONTHS.map(m => (<SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>))}</SelectContent></Select></div>
                  <div className="grid gap-2"><Label className="text-[10px] uppercase tracking-widest text-tier-3">Platform</Label><Select value={newSales.platform} onValueChange={(v) => setNewSales({...newSales, platform: v})}><SelectTrigger className="bg-white/[0.03] border-white/[0.08] h-12 rounded-xl text-tier-1"><SelectValue /></SelectTrigger><SelectContent>{PLATFORMS.map(p => (<SelectItem key={p} value={p}>{p}</SelectItem>))}</SelectContent></Select></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2"><Label className="text-[10px] uppercase tracking-widest text-tier-3">Orders</Label><Input type="number" value={newSales.orders} onChange={(e) => setNewSales({...newSales, orders: Number(e.target.value)})} className="bg-white/[0.03] border-white/[0.08] h-12 rounded-xl" /></div>
                  <div className="grid gap-2"><Label className="text-[10px] uppercase tracking-widest text-tier-3">Gross Sales ($)</Label><Input type="number" value={newSales.grossSales} onChange={(e) => setNewSales({...newSales, grossSales: Number(e.target.value)})} className="bg-white/[0.03] border-white/[0.08] h-12 rounded-xl" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2"><Label className="text-[10px] uppercase tracking-widest text-tier-3">Discounts ($)</Label><Input type="number" value={newSales.discounts} onChange={(e) => setNewSales({...newSales, discounts: Number(e.target.value)})} className="bg-white/[0.03] border-white/[0.08] h-12 rounded-xl" /></div>
                  <div className="grid gap-2"><Label className="text-[10px] uppercase tracking-widest text-tier-3">Refunds ($)</Label><Input type="number" value={newSales.refunds} onChange={(e) => setNewSales({...newSales, refunds: Number(e.target.value)})} className="bg-white/[0.03] border-white/[0.08] h-12 rounded-xl" /></div>
                </div>
              </div>
              <DialogFooter><Button onClick={handleAddSales} className="w-full bg-primary text-white h-12 rounded-xl font-bold uppercase tracking-widest">Authorize Sales Data</Button></DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isExpenseModalOpen} onOpenChange={setIsExpenseModalOpen}>
            <DialogTrigger asChild>
              <Button className="h-11 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white text-[11px] font-bold uppercase tracking-wider shadow-lg shadow-primary/20">
                <Plus className="size-4 mr-2" /> Log Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-background/95 backdrop-blur-2xl border-white/[0.1] rounded-2xl sm:max-w-[500px]">
              <DialogHeader><DialogTitle className="text-xl font-bold tracking-tight text-tier-1">Record Business Expense</DialogTitle></DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid gap-2"><Label className="text-[10px] uppercase tracking-widest text-tier-3">Date</Label><Input type="date" value={newExpense.date} onChange={(e) => setNewExpense({...newExpense, date: e.target.value})} className="bg-white/[0.03] border-white/[0.08] h-12 rounded-xl" /></div>
                <div className="grid gap-2"><Label className="text-[10px] uppercase tracking-widest text-tier-3">Description</Label><Input placeholder="e.g. Meta Ads Week 3" value={newExpense.description} onChange={(e) => setNewExpense({...newExpense, description: e.target.value})} className="bg-white/[0.03] border-white/[0.08] h-12 rounded-xl" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2"><Label className="text-[10px] uppercase tracking-widest text-tier-3">Amount ($)</Label><Input type="number" value={newExpense.amount} onChange={(e) => setNewExpense({...newExpense, amount: Number(e.target.value)})} className="bg-white/[0.03] border-white/[0.08] h-12 rounded-xl" /></div>
                  <div className="grid gap-2"><Label className="text-[10px] uppercase tracking-widest text-tier-3">Category</Label><Select value={newExpense.category} onValueChange={(v) => setNewExpense({...newExpense, category: v})}><SelectTrigger className="bg-white/[0.03] border-white/[0.08] h-12 rounded-xl"><SelectValue /></SelectTrigger><SelectContent>{EXPENSE_CATEGORIES.map(c => (<SelectItem key={c} value={c}>{c}</SelectItem>))}</SelectContent></Select></div>
                </div>
                <div className="grid gap-2"><Label className="text-[10px] uppercase tracking-widest text-tier-3">Platform Linked (Optional)</Label><Select value={newExpense.platform} onValueChange={(v) => setNewExpense({...newExpense, platform: v})}><SelectTrigger className="bg-white/[0.03] border-white/[0.08] h-12 rounded-xl"><SelectValue placeholder="General / All" /></SelectTrigger><SelectContent><SelectItem value="all">General / All</SelectItem>{PLATFORMS.map(p => (<SelectItem key={p} value={p}>{p}</SelectItem>))}</SelectContent></Select></div>
              </div>
              <DialogFooter><Button onClick={handleAddExpense} className="w-full bg-primary text-white h-12 rounded-xl font-bold uppercase tracking-widest">Commit to Ledger</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Primary KPI Rail */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6">
        <StatCard label="Total Revenue" value={`$${(metrics.totalRev / 1000).toFixed(1)}k`} icon={DollarSign} iconColor="text-emerald-400" />
        <StatCard label="Total Expenses" value={`$${(metrics.totalExp / 1000).toFixed(1)}k`} icon={CreditCard} iconColor="text-rose-400" />
        <StatCard 
          label="Net Result" 
          value={`$${(metrics.netResult / 1000).toFixed(1)}k`} 
          icon={metrics.isProfitable ? TrendingUp : TrendingDown} 
          iconColor={metrics.isProfitable ? "text-emerald-400" : "text-rose-400"}
          trend={metrics.isProfitable ? "PROFITABLE" : "LOSING MONEY"}
          trendUp={metrics.isProfitable}
        />
        <StatCard label="Total Orders" value={metrics.totalOrders} icon={ShoppingCart} iconColor="text-primary" />
        <StatCard label="Avg Order Value" value={`$${metrics.aov.toFixed(1)}`} icon={Percent} iconColor="text-accent" />
        <StatCard label="Best Platform" value={metrics.bestPlatform} icon={Target} iconColor="text-blue-400" />
        <StatCard label="Top Expense" value={metrics.biggestExpenseCategory.split(':')[1]?.trim() || metrics.biggestExpenseCategory} icon={ShieldCheck} iconColor="text-amber-400" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Left Column: Platform Performance & Money Flow */}
        <div className="xl:col-span-8 flex flex-col gap-10">
          <section className="flex flex-col gap-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex flex-col gap-1">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.25em] text-tier-1">Platform Performance Breakdown</h2>
                <span className="text-[13px] text-tier-3 font-medium">Net profitability after platform costs and ad spend.</span>
              </div>
              {metrics.isImproving && (
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[9px] uppercase tracking-widest font-bold h-7">
                  <TrendingUp className="size-3 mr-1.5" /> Performance Improving
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PLATFORMS.map(platform => {
                const sales = monthlySales.find(s => s.platform === platform);
                const netSales = (sales?.grossSales || 0) - (sales?.discounts || 0) - (sales?.refunds || 0);
                const adSpend = monthlyExpenses.filter(e => e.platform === platform && e.category === "Marketing: Ad Spend").reduce((sum, e) => sum + e.amount, 0);
                const otherCosts = monthlyExpenses.filter(e => e.platform === platform && e.category !== "Marketing: Ad Spend").reduce((sum, e) => sum + e.amount, 0);
                const result = netSales - adSpend - otherCosts;

                return (
                  <div key={platform} className="premium-panel p-6 rounded-2xl flex flex-col gap-5 group hover:border-primary/40 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="text-base font-bold text-tier-1 group-hover:text-primary transition-colors">{platform}</span>
                        <span className="text-[10px] text-tier-4 font-bold uppercase tracking-widest">{sales?.orders || 0} Orders Collected</span>
                      </div>
                      <Badge variant="outline" className={cn(
                        "text-[9px] uppercase tracking-widest font-bold",
                        result > 0 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      )}>
                        {result > 0 ? `+$${(result/1000).toFixed(1)}k Result` : `-$${(Math.abs(result)/1000).toFixed(1)}k Loss`}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 pt-2 border-t border-white/[0.03]">
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-tier-4 font-bold uppercase tracking-widest">Net Sales</span>
                        <span className="text-[14px] font-semibold text-tier-1">${(netSales/1000).toFixed(1)}k</span>
                      </div>
                      <div className="flex flex-col gap-1 text-center">
                        <span className="text-[9px] text-tier-4 font-bold uppercase tracking-widest">Ad Spend</span>
                        <span className="text-[14px] font-semibold text-rose-400">${(adSpend/1000).toFixed(1)}k</span>
                      </div>
                      <div className="flex flex-col gap-1 text-right">
                        <span className="text-[9px] text-tier-4 font-bold uppercase tracking-widest">Operations</span>
                        <span className="text-[14px] font-semibold text-amber-400">${(otherCosts/1000).toFixed(1)}k</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="flex flex-col gap-6">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-tier-4 px-2">Money In (Revenue)</h3>
              <div className="flex flex-col gap-3">
                {monthlySales.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-4 bg-white/[0.015] border border-white/[0.05] rounded-xl group hover:border-emerald-500/30 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <DollarSign className="size-4" />
                      </div>
                      <span className="text-[13px] font-medium text-tier-2">{s.platform}</span>
                    </div>
                    <span className="text-[14px] font-bold text-tier-1">+${((s.grossSales - s.discounts - s.refunds)/1000).toFixed(1)}k</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-tier-4 px-2">Money Out (Expenses)</h3>
              <div className="flex flex-col gap-3">
                {Object.entries(metrics.expenseByCategory).filter(([, val]) => val > 0).map(([cat, val]) => (
                  <div key={cat} className="flex items-center justify-between p-4 bg-white/[0.015] border border-white/[0.05] rounded-xl group hover:border-rose-500/30 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-rose-500/5 border border-rose-500/20 flex items-center justify-center text-rose-400">
                        <TrendingDown className="size-4" />
                      </div>
                      <span className="text-[13px] font-medium text-tier-2">{cat.split(':')[1]?.trim() || cat}</span>
                    </div>
                    <span className="text-[14px] font-bold text-tier-1">-${(val/1000).toFixed(1)}k</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Where Money Went & Attention */}
        <div className="xl:col-span-4 flex flex-col gap-10">
          <section className="premium-panel p-8 rounded-3xl flex flex-col gap-8 bg-gradient-to-br from-primary/5 via-transparent to-transparent shadow-2xl relative overflow-hidden">
            <div className="flex flex-col gap-1 relative z-10">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-tier-1">Where Money Went</h3>
              <span className="text-[13px] text-tier-3 font-medium">Allocation of business capital by category.</span>
            </div>

            <div className="flex flex-col gap-5 relative z-10">
              {Object.entries(metrics.expenseByCategory).sort((a, b) => b[1] - a[1]).map(([cat, amount]) => {
                if (amount === 0) return null;
                const percentage = (amount / metrics.totalExp) * 100;
                return (
                  <div key={cat} className="flex flex-col gap-2 group">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-semibold text-tier-2 group-hover:text-tier-1 transition-colors">{cat}</span>
                      <span className="text-[12px] font-bold text-tier-1">${amount.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-primary/40 rounded-full transition-all duration-1000 group-hover:bg-primary/60" style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <Separator className="bg-white/[0.04]" />
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-tier-4">Operational Leverage</span>
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-tier-2">Efficiency Ratio</span>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[9px] font-bold tracking-widest">
                  {((metrics.totalExp / metrics.totalRev) * 100).toFixed(1)}% Cost/Rev
                </Badge>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-6">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-tier-4 px-2">Needs Attention</h3>
            <div className="flex flex-col gap-4">
              {metrics.totalExp > metrics.totalRev && (
                <AttentionItem title="Negative Burn Detected" desc="Expenses exceeded revenue for this operational cycle." icon={AlertCircle} color="rose" />
              )}
              {PLATFORMS.map(p => {
                const sales = monthlySales.find(s => s.platform === p);
                const netSales = (sales?.grossSales || 0) - (sales?.discounts || 0) - (sales?.refunds || 0);
                const adSpend = monthlyExpenses.filter(e => e.platform === p && e.category === "Marketing: Ad Spend").reduce((sum, e) => sum + e.amount, 0);
                if (netSales > 0 && (adSpend / netSales) > 0.4) {
                  return <AttentionItem key={p} title={`High Ad Burn: ${p}`} desc="Advertising spend is exceeding 40% of net sales." icon={TrendingUp} color="amber" />;
                }
                return null;
              })}
              {monthlySales.length < PLATFORMS.length && (
                <AttentionItem title="Incomplete Platform Data" desc="One or more platforms are missing sales entries for this month." icon={LayoutGrid} color="amber" />
              )}
              {metrics.isProfitable && (
                <AttentionItem title="Profitable Cycle Verified" desc="Business is generating positive net capital contribution." icon={CheckCircle2} color="emerald" />
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function AttentionItem({ title, desc, icon: Icon, color }: { title: string, desc: string, icon: any, color: 'rose' | 'amber' | 'emerald' }) {
  const styles = {
    rose: "bg-rose-500/5 border-rose-500/20 text-rose-400",
    amber: "bg-amber-500/5 border-amber-500/20 text-amber-400",
    emerald: "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
  };

  return (
    <div className={cn("p-5 rounded-2xl border flex items-start gap-4 shadow-lg", styles[color])}>
      <div className="size-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="size-5" />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[13px] font-bold leading-none">{title}</span>
        <span className="text-[11px] font-medium opacity-80 leading-relaxed">{desc}</span>
      </div>
    </div>
  );
}
