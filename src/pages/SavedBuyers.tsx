import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bookmark,
  Store,
  MapPin,
  Phone,
  Mail,
  Globe,
  Trash2,
  ArrowRight,
  Search,
  ExternalLink,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useToastContext } from "@/components/ToastProvider";
import { supabase } from "@/lib/supabase";
import type { SavedBuyer } from "@/types";

export default function SavedBuyers() {
  const navigate = useNavigate();
  const { showToast } = useToastContext();
  const [buyers, setBuyers] = useState<SavedBuyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadSavedBuyers();
  }, []);

  async function loadSavedBuyers() {
    const { data, error } = await supabase
      .from("saved_buyers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      showToast("Failed to load saved buyers.", "error");
      setLoading(false);
      return;
    }
    setBuyers(data || []);
    setLoading(false);
  }

  async function handleRemove(id: string, name: string) {
    const { error } = await supabase
      .from("saved_buyers")
      .delete()
      .eq("id", id);

    if (error) {
      showToast("Failed to remove buyer.", "error");
      return;
    }
    setBuyers((prev) => prev.filter((b) => b.id !== id));
    showToast(`Removed ${name} from saved buyers.`, "info");
  }

  function handleEmail(buyer: SavedBuyer) {
    navigate("/email-campaigns", {
      state: {
        buyer: {
          place_id: buyer.place_id || "",
          name: buyer.name,
          category: buyer.category || "",
          address: buyer.address || "",
          city: buyer.city || "",
          state: buyer.state || "",
          country: buyer.country || "United States",
          phone: buyer.phone || "Phone not available",
          email: buyer.email || "Email not available",
          website: buyer.website || "Website not available",
          source: buyer.source || "Google Places API",
        },
      },
    });
  }

  const filtered = buyers.filter(
    (b) =>
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.city || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.state || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.category || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="border-b border-slate-200 bg-white px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600">
            <Bookmark className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Saved Buyers</h1>
            <p className="mt-0.5 text-sm text-slate-500">
              {buyers.length} saved {buyers.length === 1 ? "buyer" : "buyers"}
            </p>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Search bar */}
        {buyers.length > 0 && (
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, city, state, or category..."
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
                className="h-24 animate-pulse rounded-xl border border-slate-100 bg-white"
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && buyers.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50">
              <Bookmark className="h-8 w-8 text-slate-300" />
            </div>
            <p className="mt-4 text-base font-semibold text-slate-700">
              No saved buyers yet
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Find and save buyers from your search results
            </p>
            <Link
              to="/find-buyers"
              className="mt-6 flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700"
            >
              <Search className="h-4 w-4" />
              Find Buyers
            </Link>
          </div>
        )}

        {/* Buyers grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((buyer) => (
              <div
                key={buyer.id}
                className="group rounded-2xl border border-slate-100 bg-white p-6 transition-all hover:border-blue-200 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                      <Store className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-slate-900 truncate">
                        {buyer.name}
                      </h3>
                      <span className="text-xs text-blue-600">
                        {buyer.category}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(buyer.id, buyer.name)}
                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4 space-y-2.5">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
                    <span className="truncate">
                      {buyer.city && `${buyer.city}, `}
                      {buyer.state}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
                    <span className="truncate">
                      {buyer.phone === "Phone not available" ? (
                        <span className="italic text-slate-400">
                          Not available
                        </span>
                      ) : (
                        buyer.phone
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
                    <span className="truncate">
                      {buyer.email === "Email not available" ? (
                        <span className="italic text-slate-400">
                          Email not available
                        </span>
                      ) : (
                        buyer.email
                      )}
                    </span>
                  </div>
                  {buyer.website &&
                    buyer.website !== "Website not available" && (
                      <a
                        href={buyer.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                      >
                        <Globe className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="truncate">Visit Website</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                </div>

                <div className="mt-5 flex gap-2">
                  <button
                    onClick={() => handleEmail(buyer)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-50 py-2 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    Send Email
                  </button>
                  <Link
                    to="/buyer-details"
                    state={{
                      buyer: {
                        place_id: buyer.place_id || "",
                        name: buyer.name,
                        category: buyer.category || "",
                        address: buyer.address || "",
                        city: buyer.city || "",
                        state: buyer.state || "",
                        country: buyer.country || "United States",
                        phone: buyer.phone || "Phone not available",
                        email: buyer.email || "Email not available",
                        website: buyer.website || "Website not available",
                        source: buyer.source || "Google Places API",
                        google_maps_uri: "",
                      },
                    }}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                  >
                    Details
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No search results */}
        {!loading &&
          buyers.length > 0 &&
          filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white py-16">
              <Search className="h-10 w-10 text-slate-300" />
              <p className="mt-3 text-sm text-slate-500">
                No buyers match "{searchTerm}"
              </p>
            </div>
          )}
      </div>
    </DashboardLayout>
  );
}
