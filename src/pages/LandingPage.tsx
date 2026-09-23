import { Link } from "react-router-dom";
import {
  Store,
  Search,
  Mail,
  Bookmark,
  TrendingUp,
  Building2,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Zap,
  Globe,
  ShieldCheck,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
              <Store className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-900 leading-tight">
                GlobalBuyer
              </span>
              <span className="text-xs text-slate-500 leading-tight">
                Finder
              </span>
            </div>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Pricing
            </a>
          </div>
          <Link
            to="/dashboard"
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20"
          >
            Go to Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-white to-white" />
        <div className="absolute top-20 right-0 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute top-40 left-10 h-72 w-72 rounded-full bg-cyan-200/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5">
              <Zap className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-semibold text-blue-700">
                Powered by Google Places API
              </span>
            </div>
            <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-6xl">
              Find Business Buyers for
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Home Decor Products
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
              Discover thousands of potential business buyers across the United
              States using real API-powered data. Search, save, and reach out —
              all from one professional dashboard.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/find-buyers"
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30"
              >
                <Search className="h-5 w-5" />
                Start Finding Buyers
              </Link>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-3.5 text-base font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50"
              >
                View Dashboard
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mx-auto mt-20 max-w-4xl">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {[
                { icon: Globe, value: "United States", label: "Coverage Area" },
                { icon: Building2, value: "Real Data", label: "API-Powered Results" },
                { icon: Mail, value: "Email Outreach", label: "Built-in Campaigns" },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="flex flex-col items-center gap-2 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
                  >
                    <Icon className="h-7 w-7 text-blue-600" />
                    <span className="text-xl font-bold text-slate-900">
                      {stat.value}
                    </span>
                    <span className="text-sm text-slate-500">
                      {stat.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-slate-900">
              Everything you need to find buyers
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              A complete B2B prospecting toolkit designed for home decor sellers
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Search,
                title: "Smart Search",
                desc: "Filter by state, city, category, and keyword to find exactly the right buyers for your products.",
              },
              {
                icon: Building2,
                title: "Real Business Data",
                desc: "Every result comes from the Google Places API — real businesses with real addresses, phones, and websites.",
              },
              {
                icon: Bookmark,
                title: "Save & Organize",
                desc: "Save promising buyers to your list and revisit them anytime. Remove ones that aren't a fit.",
              },
              {
                icon: Mail,
                title: "Email Campaigns",
                desc: "Compose and send outreach emails directly from the platform. Track every send in your history.",
              },
              {
                icon: TrendingUp,
                title: "Dashboard Insights",
                desc: "See your buyer count, saved buyers, emails sent, and recent searches at a glance.",
              },
              {
                icon: ShieldCheck,
                title: "No Fake Data",
                desc: "We never invent business names, emails, or phone numbers. If data isn't available, we tell you.",
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-slate-100 bg-white p-7 transition-all hover:border-blue-200 hover:shadow-lg"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 transition-colors group-hover:bg-blue-600">
                    <Icon className="h-6 w-6 text-blue-600 transition-colors group-hover:text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-slate-900">
              How it works
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              From search to outreach in three simple steps
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                icon: Search,
                title: "Search for Buyers",
                desc: "Set your filters — state, city, category, keyword — and hit Find Buyers. We query the Google Places API for real US businesses.",
              },
              {
                step: "02",
                icon: Building2,
                title: "Review Details",
                desc: "Browse results in a clean table. View full details, check their website, phone, and location. Save the ones you like.",
              },
              {
                step: "03",
                icon: Mail,
                title: "Send Outreach",
                desc: "Compose a personalized email and send it directly. Every send is logged in your email history for follow-up.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="relative">
                  <div className="mb-4 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-4xl font-extrabold text-slate-200">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-cyan-700">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-bold text-white">
            Ready to find your next buyers?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
            Start searching real US businesses and send your first outreach
            email today.
          </p>
          <Link
            to="/find-buyers"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-blue-700 shadow-lg transition-all hover:shadow-xl"
          >
            <Search className="h-5 w-5" />
            Find Buyers Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <Store className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-bold text-slate-900">
                GlobalBuyer Finder
              </span>
            </div>
            <p className="text-sm text-slate-500">
              Internship Project — API Web Development
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <MapPin className="h-4 w-4" />
              United States — Home Decor Category
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
