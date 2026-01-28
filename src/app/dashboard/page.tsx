"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Users, MessageSquare, TrendingUp } from "lucide-react";

export default function DashboardOverview() {
  const [leadCount, setLeadCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [recentLeads, setRecentLeads] = useState<
    { id: string; first_name: string; last_name: string; email: string; created_at: string }[]
  >([]);
  const [recentMessages, setRecentMessages] = useState<
    { id: string; name: string; email: string; message: string; created_at: string }[]
  >([]);

  useEffect(() => {
    async function fetchData() {
      const [leadsRes, messagesRes, recentLeadsRes, recentMsgsRes] =
        await Promise.all([
          supabase.from("leads").select("*", { count: "exact", head: true }),
          supabase.from("contact_messages").select("*", { count: "exact", head: true }),
          supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(5),
          supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(5),
        ]);

      setLeadCount(leadsRes.count ?? 0);
      setMessageCount(messagesRes.count ?? 0);
      setRecentLeads(recentLeadsRes.data ?? []);
      setRecentMessages(recentMsgsRes.data ?? []);
    }
    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-black text-dark">Dashboard</h1>
      <p className="text-gray-500 mt-1">Welcome back, Ecko.</p>

      {/* Stats Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Users size={20} className="text-primary-dark" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Leads</p>
              <p className="text-2xl font-bold text-dark">{leadCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <MessageSquare size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Messages</p>
              <p className="text-2xl font-bold text-dark">{messageCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <TrendingUp size={20} className="text-accent" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">This Week</p>
              <p className="text-2xl font-bold text-dark">
                {leadCount + messageCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-dark mb-4">Recent Leads</h2>
          {recentLeads.length === 0 ? (
            <p className="text-gray-400 text-sm">No leads yet.</p>
          ) : (
            <div className="space-y-3">
              {recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <div>
                    <p className="text-sm font-semibold text-dark">
                      {lead.first_name} {lead.last_name}
                    </p>
                    <p className="text-xs text-gray-400">{lead.email}</p>
                  </div>
                  <p className="text-xs text-gray-400">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Messages */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-dark mb-4">Recent Messages</h2>
          {recentMessages.length === 0 ? (
            <p className="text-gray-400 text-sm">No messages yet.</p>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="py-2 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-dark">
                      {msg.name || "Anonymous"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
