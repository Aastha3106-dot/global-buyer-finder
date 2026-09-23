import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  History,
  Mail,
  CheckCircle2,
  XCircle,
  Clock,
  Store,
  Search,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/lib/supabase";
import type { EmailHistoryItem } from "@/types";

export default function EmailHistory() {
  const [emails, setEmails] = useState<EmailHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadEmails();
  }, []);

  async function loadEmails() {
    const { data, error } = await supabase
      .from("email_history")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setLoading(false);
      return;
    }
    setEmails(data || []);
    setLoading(false);
  }

  const filtered = emails.filter(
    (e) =>
      (e.buyer_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.recipient || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.subject || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  function statusBadge(status: string) {
    if (status === "sent") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Sent
        </span>
      );
    }
    if (status === "failed") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700">
          <XCircle className="h-3.5 w-3.5" />
          Failed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
        <Clock className="h-3.5 w-3.5" />
        Pending
      </span>
    );
  }

  return (
    <DashboardLayout>
      <div className="border-b border-slate-200 bg-white px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-700">
            <History className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Email History</h1>
            <p className="mt-0.5 text-sm text-slate-500">
              Track all your outreach emails and their status
            </p>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Search */}
        {emails.length > 0 && (
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by business, recipient, or subject..."
                className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
              />
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-xl border border-slate-100 bg-white"
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && emails.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50">
              <Mail className="h-8 w-8 text-slate-300" />
            </div>
            <p className="mt-4 text-base font-semibold text-slate-700">
              No emails sent yet
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Start an email campaign to see your history here
            </p>
            <Link
              to="/email-campaigns"
              className="mt-6 flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700"
            >
              <Mail className="h-4 w-4" />
              Compose Email
            </Link>
          </div>
        )}

        {/* Email list */}
        {!loading && filtered.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80">
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Business
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Recipient
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Subject
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Date
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((email) => (
                    <tr
                      key={email.id}
                      className="transition-colors hover:bg-slate-50/50"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-50">
                            <Store className="h-4 w-4 text-slate-400" />
                          </div>
                          <span className="text-sm font-medium text-slate-900">
                            {email.buyer_name || "—"}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-slate-600">
                          {email.recipient || "—"}
                        </span>
                      </td>
                      <td className="px-5 py-4 max-w-xs">
                        <span className="text-sm text-slate-600 truncate block">
                          {email.subject || "—"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-slate-500">
                          {new Date(email.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div>
                          {statusBadge(email.status)}
                          {email.status === "failed" &&
                            email.error_detail && (
                              <p className="mt-1 text-xs text-red-500 max-w-xs truncate">
                                {email.error_detail}
                              </p>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* No search results */}
        {!loading && emails.length > 0 && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white py-16">
            <Search className="h-10 w-10 text-slate-300" />
            <p className="mt-3 text-sm text-slate-500">
              No emails match "{searchTerm}"
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
