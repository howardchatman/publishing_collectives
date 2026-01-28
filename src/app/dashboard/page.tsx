"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import {
  Users,
  MessageSquare,
  MessageCircle,
  TrendingUp,
  ExternalLink,
  Clock,
  Mail,
  UserPlus,
} from "lucide-react";

interface ActivityItem {
  id: string;
  type: "lead" | "message" | "chat";
  title: string;
  subtitle: string;
  time: string;
  rawTime: string;
}

export default function DashboardOverview() {
  const [leadCount, setLeadCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [chatCount, setChatCount] = useState(0);
  const [weekLeads, setWeekLeads] = useState(0);
  const [weekMessages, setWeekMessages] = useState(0);
  const [weekChats, setWeekChats] = useState(0);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const weekStr = oneWeekAgo.toISOString();

      const [
        leadsRes,
        messagesRes,
        chatsRes,
        weekLeadsRes,
        weekMsgsRes,
        weekChatsRes,
        recentLeadsRes,
        recentMsgsRes,
        recentChatsRes,
      ] = await Promise.all([
        supabase.from("leads").select("*", { count: "exact", head: true }),
        supabase.from("contact_messages").select("*", { count: "exact", head: true }),
        supabase.from("chat_conversations").select("*", { count: "exact", head: true }),
        supabase.from("leads").select("*", { count: "exact", head: true }).gte("created_at", weekStr),
        supabase.from("contact_messages").select("*", { count: "exact", head: true }).gte("created_at", weekStr),
        supabase.from("chat_conversations").select("*", { count: "exact", head: true }).gte("created_at", weekStr),
        supabase.from("leads").select("id, first_name, last_name, email, created_at").order("created_at", { ascending: false }).limit(10),
        supabase.from("contact_messages").select("id, name, email, message, created_at").order("created_at", { ascending: false }).limit(10),
        supabase.from("chat_conversations").select("id, session_id, user_message, created_at").order("created_at", { ascending: false }).limit(10),
      ]);

      setLeadCount(leadsRes.count ?? 0);
      setMessageCount(messagesRes.count ?? 0);
      setChatCount(chatsRes.count ?? 0);
      setWeekLeads(weekLeadsRes.count ?? 0);
      setWeekMessages(weekMsgsRes.count ?? 0);
      setWeekChats(weekChatsRes.count ?? 0);

      // Build unified activity feed
      const items: ActivityItem[] = [];

      (recentLeadsRes.data ?? []).forEach((l) => {
        items.push({
          id: `lead-${l.id}`,
          type: "lead",
          title: `${l.first_name} ${l.last_name}`,
          subtitle: l.email,
          rawTime: l.created_at,
          time: formatTimeAgo(l.created_at),
        });
      });

      (recentMsgsRes.data ?? []).forEach((m) => {
        items.push({
          id: `msg-${m.id}`,
          type: "message",
          title: m.name || "Anonymous",
          subtitle: m.message?.slice(0, 80) + (m.message?.length > 80 ? "..." : ""),
          rawTime: m.created_at,
          time: formatTimeAgo(m.created_at),
        });
      });

      (recentChatsRes.data ?? []).forEach((c) => {
        items.push({
          id: `chat-${c.id}`,
          type: "chat",
          title: "Chat visitor",
          subtitle: c.user_message?.slice(0, 80) + (c.user_message?.length > 80 ? "..." : ""),
          rawTime: c.created_at,
          time: formatTimeAgo(c.created_at),
        });
      });

      items.sort((a, b) => new Date(b.rawTime).getTime() - new Date(a.rawTime).getTime());
      setActivity(items.slice(0, 15));
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div>
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-dark to-gray-800 rounded-2xl p-6 sm:p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black">Welcome back, Ecko</h1>
            <p className="text-white/60 mt-1 text-sm">
              Here&apos;s what&apos;s happening with Publishing Collectives today.
            </p>
          </div>
          <a
            href="https://publishingcollectives.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-dark font-semibold px-5 py-2.5 rounded-full transition-colors text-sm w-fit"
          >
            <ExternalLink size={16} />
            View Live Site
          </a>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Users size={20} />}
          iconBg="bg-primary/20"
          iconColor="text-primary-dark"
          label="Total Leads"
          value={leadCount}
          weekValue={weekLeads}
          href="/dashboard/leads"
          loading={loading}
        />
        <StatCard
          icon={<MessageSquare size={20} />}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          label="Messages"
          value={messageCount}
          weekValue={weekMessages}
          href="/dashboard/messages"
          loading={loading}
        />
        <StatCard
          icon={<MessageCircle size={20} />}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
          label="Chat Sessions"
          value={chatCount}
          weekValue={weekChats}
          href="/dashboard/chats"
          loading={loading}
        />
        <StatCard
          icon={<TrendingUp size={20} />}
          iconBg="bg-accent/20"
          iconColor="text-accent"
          label="This Week"
          value={weekLeads + weekMessages + weekChats}
          loading={loading}
        />
      </div>

      {/* Activity Feed */}
      <div className="mt-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-dark">Recent Activity</h2>
            <span className="text-xs text-gray-400 font-medium">Last 15 events</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : activity.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <p className="text-lg font-medium">No activity yet</p>
              <p className="text-sm mt-1">Leads, messages, and chats will appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {activity.map((item) => (
                <div key={item.id} className="px-6 py-3.5 flex items-start gap-3 hover:bg-gray-50/50 transition-colors">
                  <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    item.type === "lead"
                      ? "bg-primary/20"
                      : item.type === "message"
                        ? "bg-blue-100"
                        : "bg-purple-100"
                  }`}>
                    {item.type === "lead" && <UserPlus size={14} className="text-primary-dark" />}
                    {item.type === "message" && <Mail size={14} className="text-blue-600" />}
                    {item.type === "chat" && <MessageCircle size={14} className="text-purple-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-dark truncate">{item.title}</p>
                      <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full ${
                        item.type === "lead"
                          ? "bg-primary/20 text-primary-dark"
                          : item.type === "message"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-purple-100 text-purple-600"
                      }`}>
                        {item.type}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{item.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
                    <Clock size={12} />
                    {item.time}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  iconBg,
  iconColor,
  label,
  value,
  weekValue,
  href,
  loading,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  value: number;
  weekValue?: number;
  href?: string;
  loading: boolean;
}) {
  const content = (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center ${iconColor}`}>
          {icon}
        </div>
        {weekValue !== undefined && weekValue > 0 && (
          <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
            +{weekValue} this week
          </span>
        )}
      </div>
      <p className="mt-3 text-2xl font-bold text-dark">{loading ? "—" : value}</p>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}

function formatTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}
