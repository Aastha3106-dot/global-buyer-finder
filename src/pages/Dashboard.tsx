import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Bookmark,
  Mail,
  History,
  ArrowRight,
  TrendingUp,
  Users,
  Building2,
  Clock,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/lib/supabase";
import type { RecentSearch } from "@/types";

export default function Dashboard() {
  const [stats, setStats] = useState({
    buyersFound: 0,
    savedBuyers: 0,
    emailsSent: 0,
  });
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      const [savedRes, emailRes, searchesRes] = await Promise.all([
        supabase.from("saved_buyers").select("*"),
        supabase
          .from("email_history")
          .select("*")
          .eq("status", "sent"),
        supabase
          .from("recent_searches")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      const savedCount = savedRes.data?.length || 0;
      const emailCount = emailRes.data?.length || 0;
      const totalSearchResults =
        searchesRes.data?.reduce((sum, s) => sum + (s.results_count || 0), 0) ||
        0;

      setStats({
        buyersFound: totalSearchResults,
        savedBuyers: savedCount,
        emailsSent: emailCount,
      });
      setRecentSearches(searchesRes.data || []);
      setLoading(false);
    }
    loadDashboard();
  }, []);

  const statCards = [
    {
      label: "Buyers Found",
      value: stats.buyersFound,
      icon: Search,
      color: "blue",
      to: "/find-buyers",
    },
    {
      label: "Saved Buyers",
      value: stats.savedBuyers,
      icon: Bookmark,
      color: "emerald",
      to: "/saved-buyers",
    },
    {
      label: "Emails Sent",
      value: stats.emailsSent,
      icon: Mail,
      color: "amber",
      to: "/email-history",
    },
  ];

  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    blue: { bg: "bg-blue-50", text: "text-blue-600", border: "hover:border-blue-200" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-600", border: "hover:border-emerald-200" },
    amber: { bg: "bg-amber-50", text: "text-amber-600", border: "hover:border-amber-200" },
  };

  return (
    <DashboardLayout>
      <div className="border-b border-slate-200 bg-white px-8 py-6">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Overview of your buyer discovery and outreach activity
        </p>
      </div>

      <div className="p-8">
        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {statCards.map((card) => {
            const Icon = card.icon;
            const colors = colorMap[card.color];
            return (
              <Link
                key={card.label}
                to={card.to}
                className={`group rounded-2xl border border-slate-100 bg-white p-6 transition-all hover:shadow-lg ${colors.border}`}
              >
                <div className="flex items-center justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors.bg}`}>
                    <Icon className={`h-6 w-6 ${colors.text}`} />
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-slate-400" />
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-extrabold text-slate-900">
                    {loading ? "—" : card.value}
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-500">
                    {card.label}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick actions */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Recent Searches */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-100 bg-white p-6">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-slate-400" />
                <h2 className="text-lg font-semibold text-slate-900">
                  Recent Searches
                </h2>
              </div>
              <Link
                to="/find-buyers"
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                New Search
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 animate-pulse rounded-lg bg-slate-100" />
                ))}
              </div>
            ) : recentSearches.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Search className="h-10 w-10 text-slate-300" />
                <p className="mt-3 text-sm text-slate-500">
                  No searches yet. Start finding buyers!
                </p>
                <Link
                  to="/find-buyers"
                  className="mt-4 flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <Search className="h-4 w-4" />
                  Find Buyers
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {recentSearches.map((search) => (
                  <div
                    key={search.id}
                    className="flex items-center justify-between rounded-lg border border-slate-50 bg-slate-50/50 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                        <Search className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {search.query}
                        </p>
                        <p className="text-xs text-slate-400">
                          {search.results_count} results •{" "}
                          {new Date(search.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick stats sidebar */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6">
            <div className="mb-5 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-slate-400" />
              <h2 className="text-lg font-semibold text-slate-900">
                Quick Actions
              </h2>
            </div>
            <div className="space-y-3">
              <Link
                to="/find-buyers"
                className="flex items-center gap-3 rounded-xl border border-slate-100 p-4 transition-all hover:border-blue-200 hover:bg-blue-50/50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                  <Search className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">
                    Find Buyers
                  </p>
                  <p className="text-xs text-slate-500">
                    Search for new businesses
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-300" />
              </Link>

              <Link
                to="/email-campaigns"
                className="flex items-center gap-3 rounded-xl border border-slate-100 p-4 transition-all hover:border-amber-200 hover:bg-amber-50/50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
                  <Mail className="h-5 w-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">
                    Email Campaign
                  </p>
                  <p className="text-xs text-slate-500">
                    Compose and send outreach
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-300" />
              </Link>

              <Link
                to="/saved-buyers"
                className="flex items-center gap-3 rounded-xl border border-slate-100 p-4 transition-all hover:border-emerald-200 hover:bg-emerald-50/50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
                  <Bookmark className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">
                    Saved Buyers
                  </p>
                  <p className="text-xs text-slate-500">
                    View your saved list
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-300" />
              </Link>
            </div>
          </div>
        </div>

        {/* Info bar */}
        <div className="mt-8 flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/50 px-5 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <Users className="h-4 w-4 text-white" />
          </div>
          <p className="text-sm text-blue-800">
            <span className="font-semibold">API-Powered:</span> All buyer data
            comes from the Google Places API. We never fabricate business
            information.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
