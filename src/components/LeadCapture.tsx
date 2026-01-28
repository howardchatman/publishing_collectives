"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function LeadCapture() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    // Check if already dismissed this session
    const dismissed = sessionStorage.getItem("leadCaptureDismissed");
    if (dismissed) return;

    // Trigger 1: After 10 seconds
    const timer = setTimeout(() => {
      if (!hasShown) {
        setIsOpen(true);
        setHasShown(true);
      }
    }, 10000);

    // Trigger 2: On scroll past 40% of page
    const handleScroll = () => {
      const scrollPercent =
        window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (scrollPercent > 0.4 && !hasShown) {
        setIsOpen(true);
        setHasShown(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasShown]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("leadCaptureDismissed", "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const { error } = await supabase.from("leads").insert([{
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone || null,
      }]);
      if (error) throw error;
      setStatus("sent");
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch {
      setStatus("error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden animate-[fadeIn_0.3s_ease-out]">
        {/* Header */}
        <div className="bg-primary px-6 py-5">
          <h2 className="text-2xl font-black text-dark">
            Join The Collective
          </h2>
          <p className="text-dark/70 text-sm mt-1">
            Be the first to know about new releases, events, and exclusive content.
          </p>
        </div>

        {/* Form */}
        <div className="px-6 py-6">
          {status === "sent" ? (
            <div className="text-center py-4">
              <p className="text-lg font-bold text-dark">Welcome to the family!</p>
              <p className="text-gray-600 mt-1">We&apos;ll be in touch soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="lead-first" className="block text-sm font-semibold text-dark mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lead-first"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label htmlFor="lead-last" className="block text-sm font-semibold text-dark mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lead-last"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lead-email" className="block text-sm font-semibold text-dark mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="lead-email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="lead-phone" className="block text-sm font-semibold text-dark mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  id="lead-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="(555) 555-5555"
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full bg-primary hover:bg-primary-dark text-dark font-bold py-3 rounded-full transition-colors disabled:opacity-50"
              >
                {status === "sending" ? "Joining..." : "Join The Collective"}
              </button>

              {status === "error" && (
                <p className="text-red-600 text-sm text-center">
                  Something went wrong. Please try again.
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
