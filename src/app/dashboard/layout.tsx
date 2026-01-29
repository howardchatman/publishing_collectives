"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  MessageCircle,
  Share2,
  Settings,
  LogOut,
  ArrowLeft,
  Menu,
  X,
  BarChart3,
} from "lucide-react";

const ADMIN_EMAILS = ["es@publishingcollectives.com"];

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, badgeKey: null },
  { href: "/dashboard/leads", label: "Leads", icon: Users, badgeKey: "leads" as const },
  { href: "/dashboard/messages", label: "Messages", icon: MessageSquare, badgeKey: "messages" as const },
  { href: "/dashboard/chats", label: "Chat Logs", icon: MessageCircle, badgeKey: "chats" as const },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3, badgeKey: null },
  { href: "/dashboard/social", label: "Social Media", icon: Share2, badgeKey: null },
  { href: "/dashboard/settings", label: "Settings", icon: Settings, badgeKey: null },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [badges, setBadges] = useState<Record<string, number>>({});

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user || !ADMIN_EMAILS.includes(user.email ?? "")) {
        router.replace("/login");
      } else {
        setAuthChecked(true);
      }
    });
  }, [router]);

  useEffect(() => {
    if (!authChecked) return;
    async function fetchBadges() {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const weekStr = oneWeekAgo.toISOString();

      const [leadsRes, msgsRes, chatsRes] = await Promise.all([
        supabase.from("leads").select("*", { count: "exact", head: true }).gte("created_at", weekStr),
        supabase.from("contact_messages").select("*", { count: "exact", head: true }).gte("created_at", weekStr),
        supabase.from("chat_conversations").select("*", { count: "exact", head: true }).gte("created_at", weekStr),
      ]);
      setBadges({
        leads: leadsRes.count ?? 0,
        messages: msgsRes.count ?? 0,
        chats: chatsRes.count ?? 0,
      });
    }
    fetchBadges();
  }, [authChecked]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-dark text-white flex items-center justify-between px-4 py-3">
        <h2 className="text-sm font-bold">Admin Dashboard</h2>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white p-1"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-64 bg-dark text-white flex flex-col fixed h-full z-50 transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="px-6 py-6 border-b border-white/10">
          <h2 className="text-lg font-bold">Publishing Collectives</h2>
          <p className="text-sm text-white/50 mt-0.5">Admin Dashboard</p>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const badgeCount = item.badgeKey ? badges[item.badgeKey] ?? 0 : 0;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-dark"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <span className="flex items-center gap-3">
                  <item.icon size={18} />
                  {item.label}
                </span>
                {badgeCount > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? "bg-dark/20 text-dark"
                      : "bg-primary/20 text-primary"
                  }`}>
                    {badgeCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-white/10 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Site
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:text-white hover:bg-red-500/20 transition-colors w-full text-left"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">{children}</main>
    </div>
  );
}
