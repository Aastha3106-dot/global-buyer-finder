import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  Bookmark,
  Mail,
  History,
  Settings,
  Store,
  Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/find-buyers", label: "Find Buyers", icon: Search },
  { to: "/saved-buyers", label: "Saved Buyers", icon: Bookmark },
  { to: "/email-campaigns", label: "Email Campaigns", icon: Mail },
  { to: "/email-history", label: "Email History", icon: History },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200 bg-white">
        <Link to="/" className="flex items-center gap-2.5 px-6 py-5 border-b border-slate-100">
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
        </Link>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Menu
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 mb-0.5 ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                <Icon className="h-4.5 w-4.5" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-slate-100 px-4 py-4">
          <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2.5">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-medium text-blue-700">
              API-Powered Results
            </span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64">
        <div className="min-h-screen">{children}</div>
      </main>
    </div>
  );
}
