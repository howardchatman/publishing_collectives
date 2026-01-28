"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Search, Reply, ChevronDown, ChevronUp } from "lucide-react";

interface ContactMessage {
  id: string;
  name: string | null;
  email: string;
  message: string;
  created_at: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchMessages() {
      const { data } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      setMessages(data ?? []);
      setLoading(false);
    }
    fetchMessages();
  }, []);

  const filtered = messages.filter((m) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (m.name ?? "").toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.message.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-dark">Messages</h1>
          <p className="text-gray-500 mt-1">
            {filtered.length} message{filtered.length !== 1 ? "s" : ""}
            {search && ` matching "${search}"`}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mt-4 relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, email, or message..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <div className="mt-4 space-y-3">
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">
            Loading...
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">
            {search ? "No messages match your search." : "No messages yet."}
          </div>
        ) : (
          filtered.map((msg) => {
            const isExpanded = expanded === msg.id;
            return (
              <div
                key={msg.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <button
                  onClick={() => setExpanded(isExpanded ? null : msg.id)}
                  className="w-full text-left px-6 py-4 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-dark">
                          {msg.name || "Anonymous"}
                        </p>
                        <span className="text-xs text-gray-400">
                          {msg.email}
                        </span>
                      </div>
                      {!isExpanded && (
                        <p className="mt-1 text-sm text-gray-500 truncate">
                          {msg.message}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-gray-400">
                        {new Date(msg.created_at).toLocaleDateString()}{" "}
                        {new Date(msg.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {isExpanded ? (
                        <ChevronUp size={16} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={16} className="text-gray-400" />
                      )}
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-gray-100 px-6 py-4 bg-gray-50/50">
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {msg.message}
                    </p>
                    <div className="mt-4 flex items-center gap-3">
                      <a
                        href={`mailto:${msg.email}?subject=Re: Your message to Publishing Collectives&body=%0A%0A--- Original Message ---%0AFrom: ${encodeURIComponent(msg.name || "Visitor")}%0ADate: ${encodeURIComponent(new Date(msg.created_at).toLocaleString())}%0A%0A${encodeURIComponent(msg.message)}`}
                        className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-dark font-semibold px-4 py-2 rounded-full transition-colors text-sm"
                      >
                        <Reply size={14} />
                        Reply via Email
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
