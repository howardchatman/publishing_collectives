"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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

  return (
    <div>
      <h1 className="text-3xl font-black text-dark">Messages</h1>
      <p className="text-gray-500 mt-1">
        {messages.length} contact message{messages.length !== 1 ? "s" : ""}
      </p>

      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">
            Loading...
          </div>
        ) : messages.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">
            No messages yet.
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:border-primary/40 transition-colors"
              onClick={() =>
                setExpanded(expanded === msg.id ? null : msg.id)
              }
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-dark">
                    {msg.name || "Anonymous"}
                  </p>
                  <p className="text-sm text-gray-500">{msg.email}</p>
                </div>
                <p className="text-sm text-gray-400">
                  {new Date(msg.created_at).toLocaleDateString()}{" "}
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              {expanded === msg.id ? (
                <p className="mt-4 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.message}
                </p>
              ) : (
                <p className="mt-2 text-gray-500 text-sm truncate">
                  {msg.message}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
