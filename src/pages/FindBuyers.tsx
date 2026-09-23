import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Building2,
  Globe,
  Phone,
  Mail,
  Bookmark,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Store,
  Zap,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useToastContext } from "@/components/ToastProvider";
import { findBuyers } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import type { Buyer, SearchFilters } from "@/types";

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming",
];

const CATEGORIES = [
  "Home Decor",
  "Furniture Stores",
  "Home Furnishing",
  "Interior Design",
  "Antique Stores",
  "Home Goods",
  "Lighting Stores",
  "Rug Stores",
  "Window Treatment",
  "Garden Decor",
];

export default function FindBuyers() {
  const navigate = useNavigate();
  const { showToast } = useToastContext();

  const [filters, setFilters] = useState<SearchFilters>({
    country: "United States",
    state: "",
    city: "",
    category: "Home Decor",
    keyword: "",
  });

  const [results, setResults] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [apiNotConfigured, setApiNotConfigured] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  async function handleSearch() {
    setLoading(true);
    setError("");
    setApiNotConfigured(false);
    setResults([]);

    try {
      const data = await findBuyers(filters);

      if (!data.configured) {
        setApiNotConfigured(true);
        setError(
          data.error ||
            "API not configured — add GOOGLE_MAPS_API_KEY in environment variables."
        );
        setLoading(false);
        return;
      }

      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }

      setResults(data.buyers);
      setSearchQuery(data.searchQuery || "");
      setHasSearched(true);

      // Save to recent searches
      await supabase.from("recent_searches").insert({
        query: data.searchQuery || `${filters.category} in ${filters.state || filters.country}`,
        country: filters.country,
        state: filters.state,
        city: filters.city,
        category: filters.category,
        keyword: filters.keyword,
        results_count: data.buyers.length,
      });

      if (data.buyers.length === 0) {
        showToast("No buyers found. Try adjusting your filters.", "info");
      } else {
        showToast(`Found ${data.buyers.length} potential buyers!`, "success");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed. Please try again.");
      showToast("Search failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveBuyer(buyer: Buyer) {
    try {
      const { data: existing } = await supabase
        .from("saved_buyers")
        .select("id")
        .eq("place_id", buyer.place_id)
        .maybeSingle();

      if (existing) {
        showToast("This buyer is already saved.", "info");
        return;
      }

      const { error: insertError } = await supabase
        .from("saved_buyers")
        .insert({
          place_id: buyer.place_id,
          name: buyer.name,
          category: buyer.category,
          address: buyer.address,
          city: buyer.city,
          state: buyer.state,
          country: buyer.country,
          phone: buyer.phone,
          email: buyer.email,
          website: buyer.website,
          source: buyer.source,
        });

      if (insertError) throw insertError;

      setSavedIds((prev) => new Set(prev).add(buyer.place_id));
      showToast(`Saved ${buyer.name} to your list.`, "success");
    } catch {
      showToast("Failed to save buyer. Please try again.", "error");
    }
  }

  function handleViewDetails(buyer: Buyer) {
    navigate("/buyer-details", { state: { buyer } });
  }

  function handleSendEmail(buyer: Buyer) {
    navigate("/email-campaigns", { state: { buyer } });
  }

  return (
    <DashboardLayout>
      <div className="border-b border-slate-200 bg-white px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
            <Search className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Find Buyers</h1>
            <p className="mt-0.5 text-sm text-slate-500">
              Search for real US businesses using the Google Places API
            </p>
          </div>
        </div>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1">
          <Zap className="h-3.5 w-3.5 text-blue-600" />
          <span className="text-xs font-semibold text-blue-700">
            API-Powered Results
          </span>
        </div>
      </div>

      <div className="p-8">
        {/* Filters */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Search Filters
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            {/* Country */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                Country
              </label>
              <input
                type="text"
                value={filters.country}
                onChange={(e) =>
                  setFilters({ ...filters, country: e.target.value })
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                placeholder="United States"
              />
            </div>

            {/* State */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                State
              </label>
              <select
                value={filters.state}
                onChange={(e) =>
                  setFilters({ ...filters, state: e.target.value })
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all bg-white"
              >
                <option value="">All States</option>
                {US_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            {/* City */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                City
              </label>
              <input
                type="text"
                value={filters.city}
                onChange={(e) =>
                  setFilters({ ...filters, city: e.target.value })
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                placeholder="e.g. New York"
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                Business Category
              </label>
              <select
                value={filters.category}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Keyword */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                Product / Category Keyword
              </label>
              <input
                type="text"
                value={filters.keyword}
                onChange={(e) =>
                  setFilters({ ...filters, keyword: e.target.value })
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                placeholder="e.g. wall art, rugs"
              />
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Search className="h-5 w-5" />
              )}
              {loading ? "Searching..." : "Find Buyers"}
            </button>
          </div>
        </div>

        {/* API Not Configured Warning */}
        {apiNotConfigured && (
          <div className="mt-6 flex items-start gap-4 rounded-xl border border-amber-200 bg-amber-50 p-5 animate-fade-in">
            <AlertCircle className="h-6 w-6 flex-shrink-0 text-amber-600" />
            <div>
              <h3 className="text-sm font-semibold text-amber-900">
                API Not Configured
              </h3>
              <p className="mt-1 text-sm text-amber-800">
                {error}
              </p>
              <p className="mt-2 text-xs text-amber-700">
                Add the Google Maps API key in the environment variables to
                start finding real business buyers.
              </p>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && !apiNotConfigured && (
          <div className="mt-6 flex items-start gap-4 rounded-xl border border-red-200 bg-red-50 p-5 animate-fade-in">
            <AlertCircle className="h-6 w-6 flex-shrink-0 text-red-600" />
            <div>
              <h3 className="text-sm font-semibold text-red-900">
                Search Error
              </h3>
              <p className="mt-1 text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="mt-6 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-xl border border-slate-100 bg-white"
              />
            ))}
          </div>
        )}

        {/* Results */}
        {!loading && results.length > 0 && (
          <div className="mt-6 animate-fade-in">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Results ({results.length})
                </h2>
                <p className="text-sm text-slate-500">
                  Query: "{searchQuery}"
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-xs font-semibold text-emerald-700">
                  API-Powered Results
                </span>
              </div>
            </div>

            {/* Results table */}
            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/80">
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Business
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Category
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Location
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Phone
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Website
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Email
                      </th>
                      <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {results.map((buyer) => {
                      const isSaved = savedIds.has(buyer.place_id);
                      return (
                        <tr
                          key={buyer.place_id}
                          className="transition-colors hover:bg-slate-50/50"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50">
                                <Store className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-slate-900">
                                  {buyer.name}
                                </p>
                                <p className="text-xs text-slate-400">
                                  {buyer.source}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                              {buyer.category}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-start gap-1.5">
                              <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-slate-400 mt-0.5" />
                              <span className="text-sm text-slate-600">
                                {buyer.city && `${buyer.city}, `}
                                {buyer.state}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5">
                              <Phone className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
                              <span className="text-sm text-slate-600">
                                {buyer.phone === "Phone not available" ? (
                                  <span className="text-slate-400 italic">
                                    Not available
                                  </span>
                                ) : (
                                  buyer.phone
                                )}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            {buyer.website &&
                            buyer.website !== "Website not available" ? (
                              <a
                                href={buyer.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 hover:underline"
                              >
                                <Globe className="h-3.5 w-3.5" />
                                Visit
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            ) : (
                              <span className="text-sm text-slate-400 italic">
                                Not available
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            {buyer.email === "Email not available" ? (
                              <span className="text-sm text-slate-400 italic">
                                Email not available
                              </span>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <Mail className="h-3.5 w-3.5 text-slate-400" />
                                <span className="text-sm text-slate-600">
                                  {buyer.email}
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleViewDetails(buyer)}
                                className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100"
                              >
                                Details
                              </button>
                              <button
                                onClick={() => handleSaveBuyer(buyer)}
                                disabled={isSaved}
                                className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                                  isSaved
                                    ? "bg-emerald-50 text-emerald-600 cursor-default"
                                    : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-600"
                                }`}
                              >
                                <Bookmark
                                  className={`h-3.5 w-3.5 ${isSaved ? "fill-emerald-500" : ""}`}
                                />
                                {isSaved ? "Saved" : "Save"}
                              </button>
                              <button
                                onClick={() => handleSendEmail(buyer)}
                                className="flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100"
                              >
                                <Mail className="h-3.5 w-3.5" />
                                Email
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Empty state after search */}
        {!loading && hasSearched && results.length === 0 && !error && (
          <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white py-16">
            <Search className="h-12 w-12 text-slate-300" />
            <p className="mt-4 text-sm font-medium text-slate-600">
              No buyers found for this search
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Try adjusting your filters or using different keywords
            </p>
          </div>
        )}

        {/* Initial state */}
        {!loading && !hasSearched && !error && (
          <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
              <Search className="h-8 w-8 text-blue-600" />
            </div>
            <p className="mt-4 text-base font-semibold text-slate-700">
              Ready to find buyers
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Set your filters above and click "Find Buyers" to search for real
              US businesses
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
              <Building2 className="h-4 w-4" />
              Results powered by Google Places API
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
