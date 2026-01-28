"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! Welcome to Publishing Collectives. How can we help you today?",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);

  const quickReplies = [
    { label: "Buy a Book", text: "I would like to purchase a book" },
    { label: "Book an Event", text: "I want to book Ecko for an event" },
    { label: "Publish My Book", text: "I want to publish my own book with Publishing Collectives" },
    { label: "About August", text: "Tell me about August: The Boy Who Spoke to the Sun" },
    { label: "Contact Ecko", text: "How can I get in touch with Ecko?" },
  ];
  const [sessionId] = useState(() =>
    typeof window !== "undefined"
      ? sessionStorage.getItem("chatSessionId") ??
        (() => {
          const id = crypto.randomUUID();
          sessionStorage.setItem("chatSessionId", id);
          return id;
        })()
      : "server"
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (directMessage?: string) => {
    const messageText = directMessage ?? input;
    if (!messageText.trim() || isTyping) return;

    setShowQuickReplies(false);

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: "user",
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsTyping(true);

    try {
      // Build conversation history for the API (exclude the initial greeting)
      const apiMessages = updatedMessages
        .slice(1) // skip initial bot greeting
        .map((msg) => ({
          role: msg.sender === "user" ? "user" as const : "assistant" as const,
          content: msg.text,
        }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, sessionId }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: data.reply,
          sender: "bot",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: "Sorry, something went wrong. Please try again or visit our Contact page.",
          sender: "bot",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div
          className="mb-4 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          style={{ height: "480px" }}
        >
          {/* Header */}
          <div className="bg-primary px-4 py-3 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-dark text-sm">
                Publishing Collectives
              </h3>
              <p className="text-xs text-dark/70">
                AI-powered — ask us anything
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-dark hover:text-dark/70 transition-colors"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-primary text-dark rounded-br-md"
                      : "bg-white text-dark border border-gray-200 rounded-bl-md"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {showQuickReplies && !isTyping && (
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((qr) => (
                  <button
                    key={qr.label}
                    onClick={() => handleSend(qr.text)}
                    className="bg-white border border-primary text-dark text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-primary hover:text-dark transition-colors"
                  >
                    {qr.label}
                  </button>
                ))}
              </div>
            )}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white text-dark border border-gray-200 rounded-2xl rounded-bl-md px-3 py-2 text-sm">
                  <span className="inline-flex gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-3 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-primary"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={isTyping || !input.trim()}
                className="bg-primary text-dark rounded-full p-2 hover:bg-primary-dark transition-colors disabled:opacity-50"
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary hover:bg-primary-dark text-dark rounded-full p-4 shadow-lg transition-all hover:scale-105"
        aria-label="Open chat"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}
