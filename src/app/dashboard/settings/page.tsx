"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SettingsPage() {
  const [calendarUrl, setCalendarUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "calendar_url")
        .single();
      if (data?.value) setCalendarUrl(data.value);
    }
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    // Upsert the calendar URL
    const { error } = await supabase.from("site_settings").upsert(
      { key: "calendar_url", value: calendarUrl, updated_at: new Date().toISOString() },
      { onConflict: "key" }
    );

    setSaving(false);
    if (!error) setSaved(true);
  };

  return (
    <div>
      <h1 className="text-3xl font-black text-dark">Settings</h1>
      <p className="text-gray-500 mt-1">Manage your site configuration.</p>

      <div className="mt-8 max-w-2xl space-y-8">
        {/* Calendar Integration */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-dark">Calendar Integration</h2>
          <p className="text-sm text-gray-500 mt-1">
            Paste your Calendly, Cal.com, or Google Calendar booking page URL.
            This will appear on the Contact page so visitors can book a time
            with you.
          </p>

          <div className="mt-4">
            <label
              htmlFor="calendar-url"
              className="block text-sm font-semibold text-dark mb-1"
            >
              Booking Page URL
            </label>
            <input
              type="url"
              id="calendar-url"
              value={calendarUrl}
              onChange={(e) => {
                setCalendarUrl(e.target.value);
                setSaved(false);
              }}
              placeholder="https://calendly.com/ecko-steadman"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-primary hover:bg-primary-dark text-dark font-semibold px-6 py-2.5 rounded-full transition-colors disabled:opacity-50 text-sm"
            >
              {saving ? "Saving..." : "Save Calendar Link"}
            </button>
            {saved && (
              <span className="text-green-600 text-sm font-medium">
                Saved!
              </span>
            )}
          </div>

          {calendarUrl && (
            <div className="mt-6">
              <p className="text-xs text-gray-400 mb-2">Preview:</p>
              <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                <iframe
                  src={calendarUrl}
                  width="100%"
                  height="400"
                  frameBorder="0"
                  className="w-full"
                  title="Calendar preview"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
