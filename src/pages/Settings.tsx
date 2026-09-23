import { useEffect, useState } from "react";
import {
  Settings as SettingsIcon,
  CheckCircle2,
  XCircle,
  MapPin,
  Mail,
  Shield,
  Key,
  ExternalLink,
  Loader2,
  Info,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { getApiStatus } from "@/lib/api";
import type { ApiStatusResponse } from "@/types";

export default function Settings() {
  const [apiStatus, setApiStatus] = useState<ApiStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStatus() {
      const status = await getApiStatus();
      setApiStatus(status);
      setLoading(false);
    }
    loadStatus();
  }, []);

  function StatusCard({
    title,
    description,
    status,
    icon: Icon,
    envVar,
    iconColor,
  }: {
    title: string;
    description: string;
    status: string;
    icon: typeof MapPin;
    envVar: string;
    iconColor: string;
  }) {
    const configured = status === "Connected";

    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconColor}`}
            >
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                {title}
              </h3>
              <p className="text-sm text-slate-500">{description}</p>
            </div>
          </div>
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin text-slate-300" />
          ) : configured ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              Connected
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              <XCircle className="h-4 w-4" />
              Not Configured
            </span>
          )}
        </div>

        <div className="mt-5 rounded-lg bg-slate-50 p-4">
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Environment Variable
            </span>
          </div>
          <code className="mt-2 block text-sm font-mono text-slate-700">
            {envVar}
          </code>
          {!configured && (
            <p className="mt-3 text-xs text-slate-500">
              Add this environment variable to enable this integration.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="border-b border-slate-200 bg-white px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-700">
            <SettingsIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
            <p className="mt-0.5 text-sm text-slate-500">
              API configuration and integration status
            </p>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* API Status */}
          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
              API Integrations
            </h2>
            <div className="space-y-4">
              <StatusCard
                title="Google Places API"
                description="Powers the buyer search with real US business data"
                status={apiStatus?.googlePlacesAPI || "Not Configured"}
                icon={MapPin}
                envVar="GOOGLE_MAPS_API_KEY"
                iconColor="bg-blue-600"
              />
              <StatusCard
                title="Email API"
                description="Sends outreach emails to potential buyers (Resend)"
                status={apiStatus?.emailAPI || "Not Configured"}
                icon={Mail}
                envVar="RESEND_API_KEY"
                iconColor="bg-amber-500"
              />
            </div>
          </div>

          {/* Security note */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                <Shield className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Security & Privacy
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                  All API keys and secrets are stored as server-side
                  environment variables and are never exposed in frontend code.
                  The application communicates with edge functions that proxy
                  requests to external APIs, keeping your keys secure.
                </p>
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-medium text-emerald-700">
                    Secrets are kept in environment variables only
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Data integrity note */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50">
                <Info className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Data Integrity
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                  GlobalBuyer Finder never fabricates business information. All
                  buyer records come from the Google Places API. If an email
                  address or phone number isn't available from the API, it will
                  be displayed as "Not available" — we never invent contact
                  details.
                </p>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
            <h3 className="text-sm font-semibold text-slate-900">
              About GlobalBuyer Finder
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              A B2B SaaS tool for home decor sellers to discover and contact
              potential business buyers across the United States. Built as an
              internship project for API Web Development.
            </p>
            <a
              href="https://developers.google.com/maps/documentation/places/web-service/text-search"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
            >
              Google Places API Documentation
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
