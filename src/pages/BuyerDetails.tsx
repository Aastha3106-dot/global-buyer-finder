import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Store,
  MapPin,
  Phone,
  Mail,
  Globe,
  Tag,
  Bookmark,
  Building2,
  ExternalLink,
  Send,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useToastContext } from "@/components/ToastProvider";
import { supabase } from "@/lib/supabase";
import type { Buyer } from "@/types";
import { useState } from "react";

export default function BuyerDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToastContext();
  const [saved, setSaved] = useState(false);

  const buyer = (location.state as { buyer: Buyer } | null)?.buyer;

  if (!buyer) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-24">
          <Store className="h-12 w-12 text-slate-300" />
          <p className="mt-4 text-sm font-medium text-slate-600">
            No buyer selected
          </p>
          <Link
            to="/find-buyers"
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Find Buyers
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  async function handleSave() {
    if (!buyer) return;
    try {
      const { data: existing } = await supabase
        .from("saved_buyers")
        .select("id")
        .eq("place_id", buyer.place_id)
        .maybeSingle();

      if (existing) {
        showToast("This buyer is already saved.", "info");
        setSaved(true);
        return;
      }

      const { error } = await supabase.from("saved_buyers").insert({
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

      if (error) throw error;
      setSaved(true);
      showToast(`Saved ${buyer.name} to your list.`, "success");
    } catch {
      showToast("Failed to save buyer.", "error");
    }
  }

  const detailItems = [
    {
      icon: Tag,
      label: "Category",
      value: buyer.category,
      available: true,
    },
    {
      icon: MapPin,
      label: "Address",
      value: buyer.address,
      available: buyer.address !== "",
    },
    {
      icon: Building2,
      label: "City",
      value: buyer.city || "Not available",
      available: buyer.city !== "",
    },
    {
      icon: MapPin,
      label: "State",
      value: buyer.state || "Not available",
      available: buyer.state !== "",
    },
    {
      icon: Phone,
      label: "Phone",
      value: buyer.phone,
      available: buyer.phone !== "Phone not available",
    },
    {
      icon: Mail,
      label: "Email",
      value: buyer.email,
      available: buyer.email !== "Email not available",
    },
    {
      icon: Globe,
      label: "Website",
      value: buyer.website,
      available: buyer.website !== "Website not available",
      isLink: true,
    },
  ];

  return (
    <DashboardLayout>
      <div className="border-b border-slate-200 bg-white px-8 py-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Results
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Buyer Details</h1>
      </div>

      <div className="p-8">
        <div className="max-w-4xl">
          {/* Header card */}
          <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600">
                  <Store className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {buyer.name}
                  </h2>
                  <span className="mt-2 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                    {buyer.category}
                  </span>
                  <p className="mt-3 text-sm text-slate-500">
                    Source:{" "}
                    <span className="font-medium text-slate-700">
                      {buyer.source}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={saved}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                    saved
                      ? "bg-emerald-50 text-emerald-600"
                      : "border border-slate-200 text-slate-700 hover:border-emerald-200 hover:bg-emerald-50"
                  }`}
                >
                  <Bookmark
                    className={`h-4 w-4 ${saved ? "fill-emerald-500" : ""}`}
                  />
                  {saved ? "Saved" : "Save Buyer"}
                </button>
                <button
                  onClick={() =>
                    navigate("/email-campaigns", { state: { buyer } })
                  }
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                  Send Email
                </button>
              </div>
            </div>
          </div>

          {/* Detail grid */}
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {detailItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="rounded-xl border border-slate-100 bg-white p-5"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50">
                      <Icon className="h-4.5 w-4.5 text-slate-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        {item.label}
                      </p>
                      {item.available ? (
                        item.isLink ? (
                          <a
                            href={item.value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline break-all"
                          >
                            {item.value}
                            <ExternalLink className="h-3 w-3 flex-shrink-0" />
                          </a>
                        ) : (
                          <p className="mt-1 text-sm font-medium text-slate-900 break-words">
                            {item.value}
                          </p>
                        )
                      ) : (
                        <p className="mt-1 text-sm italic text-slate-400">
                          Not available
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map link */}
          {buyer.google_maps_uri && (
            <div className="mt-6">
              <a
                href={buyer.google_maps_uri}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-5 transition-all hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      View on Google Maps
                    </p>
                    <p className="text-xs text-slate-500">
                      See the business location and directions
                    </p>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-slate-400" />
              </a>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
