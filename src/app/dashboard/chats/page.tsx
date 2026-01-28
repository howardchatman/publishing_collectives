"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface ChatLog {
  id: string;
  session_id: string;
  user_message: string;
  assistant_message: string;
  created_at: string;
}

export default function ChatsPage() {
  const [chats, setChats] = useState<ChatLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSession, setExpandedSession] = useState<string | null>(null);

  useEffect(() => {
    async function fetchChats() {
      const { data } = await supabase
        .from("chat_conversations")
        .select("*")
        .order("created_at", { ascending: false });
      setChats(data ?? []);
      setLoading(false);
    }
    fetchChats();
  }, []);

  // Group chats by session
  const sessions = chats.reduce(
    (acc, chat) => {
      if (!acc[chat.session_id]) acc[chat.session_id] = [];
      acc[chat.session_id].push(chat);
      return acc;
    },
    {} as Record<string, ChatLog[]>
  );

  const sessionIds = Object.keys(sessions);

  return (
    <div>
      <h1 className="text-3xl font-black text-dark">Chat Logs</h1>
      <p className="text-gray-500 mt-1">
        {sessionIds.length} conversation{sessionIds.length !== 1 ? "s" : ""} —{" "}
        {chats.length} total message{chats.length !== 1 ? "s" : ""}
      </p>

      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">
            Loading...
          </div>
        ) : sessionIds.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">
            No chat conversations yet.
          </div>
        ) : (
          sessionIds.map((sessionId) => {
            const sessionChats = sessions[sessionId].sort(
              (a, b) =>
                new Date(a.created_at).getTime() -
                new Date(b.created_at).getTime()
            );
            const firstChat = sessionChats[0];
            const isExpanded = expandedSession === sessionId;

            return (
              <div
                key={sessionId}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedSession(isExpanded ? null : sessionId)
                  }
                  className="w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-dark text-sm">
                        {sessionChats[0].user_message.slice(0, 60)}
                        {sessionChats[0].user_message.length > 60 ? "..." : ""}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {sessionChats.length} message
                        {sessionChats.length !== 1 ? "s" : ""} in conversation
                      </p>
                    </div>
                    <p className="text-xs text-gray-400">
                      {new Date(firstChat.created_at).toLocaleDateString()}{" "}
                      {new Date(firstChat.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-gray-100 px-6 py-4 space-y-3 bg-gray-50">
                    {sessionChats.map((chat) => (
                      <div key={chat.id} className="space-y-2">
                        <div className="flex justify-end">
                          <div className="bg-primary text-dark text-sm px-3 py-2 rounded-2xl rounded-br-md max-w-[75%]">
                            {chat.user_message}
                          </div>
                        </div>
                        <div className="flex justify-start">
                          <div className="bg-white text-dark text-sm px-3 py-2 rounded-2xl rounded-bl-md border border-gray-200 max-w-[75%]">
                            {chat.assistant_message}
                          </div>
                        </div>
                      </div>
                    ))}
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
