"use client";

import Image from "next/image";
import { useState, useEffect, FormEvent } from "react";
import { supabase } from "@/lib/supabase";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [calendarUrl, setCalendarUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCalendarUrl() {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "calendar_url")
        .single();
      if (data?.value) setCalendarUrl(data.value);
    }
    fetchCalendarUrl();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const { error } = await supabase.from("contact_messages").insert([formData]);
      if (error) throw error;
      setStatus("sent");
      setFormData({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-start">
          {/* Form */}
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-dark tracking-tight">
              Contact Us
            </h1>
            <p className="mt-4 text-gray-700 leading-relaxed">
              Reach out to us for inquiries, partnerships, or event bookings
              related to any book series.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-dark mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-dark mb-1"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold text-dark mb-1"
                >
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical"
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="bg-primary hover:bg-primary-dark text-dark font-semibold px-8 py-3 rounded-full transition-colors disabled:opacity-50"
              >
                {status === "sending" ? "Sending..." : "Contact Us"}
              </button>

              {status === "sent" && (
                <p className="text-green-600 font-medium">
                  Thank you! Your message has been sent successfully.
                </p>
              )}
              {status === "error" && (
                <p className="text-red-600 font-medium">
                  Something went wrong. Please try again.
                </p>
              )}
            </form>
          </div>

          {/* Image */}
          <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden bg-gray-200">
            <Image
              src="/images/contact.jpg"
              alt="Author at a book signing event"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Book a Time with Ecko */}
      <section className="bg-light">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-dark tracking-tight">
            Book a Time to Speak with Ecko
          </h2>
          <p className="mt-4 text-gray-700 leading-relaxed max-w-2xl mx-auto">
            Want to discuss a partnership, book signing, school visit, or
            publishing your own story? Schedule a time that works for you.
          </p>

          {calendarUrl ? (
            <div className="mt-8 rounded-xl overflow-hidden border border-gray-200 bg-white">
              <iframe
                src={calendarUrl}
                width="100%"
                height="700"
                frameBorder="0"
                className="w-full"
                title="Book a time with Ecko"
              />
            </div>
          ) : (
            <div className="mt-8 bg-white rounded-xl border border-gray-200 p-12">
              <p className="text-gray-500">
                Calendar scheduling coming soon. In the meantime, send a
                message above and Ecko will get back to you!
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
