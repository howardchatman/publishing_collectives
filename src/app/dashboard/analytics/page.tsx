"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Users, MessageSquare, MessageCircle, Calendar } from "lucide-react";

interface DayData {
  date: string;
  leads: number;
  messages: number;
  chats: number;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<DayData[]>([]);
  const [totals, setTotals] = useState({ leads: 0, messages: 0, chats: 0 });
  const [range, setRange] = useState<7 | 14 | 30>(7);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - range);
      const startStr = startDate.toISOString();

      const [leadsRes, msgsRes, chatsRes] = await Promise.all([
        supabase.from("leads").select("created_at").gte("created_at", startStr),
        supabase.from("contact_messages").select("created_at").gte("created_at", startStr),
        supabase.from("chat_conversations").select("created_at").gte("created_at", startStr),
      ]);

      // Build per-day data
      const days: Record<string, DayData> = {};
      for (let i = 0; i < range; i++) {
        const d = new Date();
        d.setDate(d.getDate() - (range - 1 - i));
        const key = d.toISOString().split("T")[0];
        days[key] = { date: key, leads: 0, messages: 0, chats: 0 };
      }

      let leadTotal = 0, msgTotal = 0, chatTotal = 0;

      (leadsRes.data ?? []).forEach((r) => {
        const key = r.created_at.split("T")[0];
        if (days[key]) days[key].leads++;
        leadTotal++;
      });
      (msgsRes.data ?? []).forEach((r) => {
        const key = r.created_at.split("T")[0];
        if (days[key]) days[key].messages++;
        msgTotal++;
      });
      (chatsRes.data ?? []).forEach((r) => {
        const key = r.created_at.split("T")[0];
        if (days[key]) days[key].chats++;
        chatTotal++;
      });

      setData(Object.values(days));
      setTotals({ leads: leadTotal, messages: msgTotal, chats: chatTotal });
      setLoading(false);
    }
    fetchAnalytics();
  }, [range]);

  const maxValue = Math.max(...data.map((d) => d.leads + d.messages + d.chats), 1);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-dark">Analytics</h1>
          <p className="text-gray-500 mt-1">Track engagement over time</p>
        </div>
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
          {([7, 14, 30] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                range === r
                  ? "bg-dark text-white"
                  : "text-gray-500 hover:text-dark"
              }`}
            >
              {r}d
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Users size={20} className="text-primary-dark" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark">{loading ? "—" : totals.leads}</p>
              <p className="text-sm text-gray-500">Leads ({range}d)</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <MessageSquare size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark">{loading ? "—" : totals.messages}</p>
              <p className="text-sm text-gray-500">Messages ({range}d)</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <MessageCircle size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark">{loading ? "—" : totals.chats}</p>
              <p className="text-sm text-gray-500">Chat Sessions ({range}d)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Calendar size={18} className="text-gray-400" />
          <h2 className="text-lg font-bold text-dark">Daily Activity</h2>
        </div>

        {loading ? (
          <div className="h-48 flex items-center justify-center text-gray-400">Loading...</div>
        ) : (
          <>
            {/* Chart */}
            <div className="flex items-end gap-1 h-48">
              {data.map((day) => {
                const total = day.leads + day.messages + day.chats;
                const height = total > 0 ? Math.max((total / maxValue) * 100, 4) : 0;
                return (
                  <div key={day.date} className="flex-1 flex flex-col items-center gap-1 group relative">
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 hidden group-hover:block bg-dark text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-10">
                      <p className="font-bold">{new Date(day.date + "T12:00:00").toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}</p>
                      {day.leads > 0 && <p>Leads: {day.leads}</p>}
                      {day.messages > 0 && <p>Messages: {day.messages}</p>}
                      {day.chats > 0 && <p>Chats: {day.chats}</p>}
                      {total === 0 && <p>No activity</p>}
                    </div>

                    {/* Stacked bar */}
                    <div
                      className="w-full rounded-t-sm overflow-hidden flex flex-col-reverse transition-all"
                      style={{ height: `${height}%` }}
                    >
                      {day.leads > 0 && (
                        <div
                          className="bg-primary w-full"
                          style={{ height: `${(day.leads / total) * 100}%` }}
                        />
                      )}
                      {day.messages > 0 && (
                        <div
                          className="bg-blue-400 w-full"
                          style={{ height: `${(day.messages / total) * 100}%` }}
                        />
                      )}
                      {day.chats > 0 && (
                        <div
                          className="bg-purple-400 w-full"
                          style={{ height: `${(day.chats / total) * 100}%` }}
                        />
                      )}
                    </div>
                    {total === 0 && (
                      <div className="w-full bg-gray-100 rounded-t-sm" style={{ height: "2px" }} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* X-axis labels (show first, middle, last) */}
            <div className="flex justify-between mt-2 text-[10px] text-gray-400">
              <span>{formatShortDate(data[0]?.date)}</span>
              <span>{formatShortDate(data[Math.floor(data.length / 2)]?.date)}</span>
              <span>{formatShortDate(data[data.length - 1]?.date)}</span>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-primary" /> Leads
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-400" /> Messages
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-purple-400" /> Chats
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function formatShortDate(dateStr?: string): string {
  if (!dateStr) return "";
  return new Date(dateStr + "T12:00:00").toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}
