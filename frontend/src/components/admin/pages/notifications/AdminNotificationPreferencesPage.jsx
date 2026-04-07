import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FiBell,
  FiCalendar,
  FiTool,
  FiSettings,
  FiSave,
} from "react-icons/fi";
import {
  getMyNotificationPreferences,
  saveMyNotificationPreferences,
} from "../../../../services/notificationService";

function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative h-8 w-16 rounded-full transition ${
        checked
          ? "bg-gradient-to-r from-orange-500 to-amber-400"
          : "bg-white/10 border border-white/10"
      }`}
    >
      <span
        className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition ${
          checked ? "left-9" : "left-1"
        }`}
      />
    </button>
  );
}

function PreferenceCard({ icon, title, desc, checked, onToggle }) {
  return (
    <div className="rounded-3xl border border-orange-500/20 bg-white/[0.04] p-5 shadow-lg backdrop-blur-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 text-white shadow-lg">
            {icon}
          </div>

          <div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="mt-1 text-sm text-zinc-400">{desc}</p>
          </div>
        </div>

        <ToggleSwitch checked={checked} onChange={onToggle} />
      </div>
    </div>
  );
}

export default function AdminNotificationPreferencesPage() {
  const [form, setForm] = useState({
    bookingNotifications: true,
    ticketNotifications: true,
    systemNotifications: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        setLoading(true);
        const res = await getMyNotificationPreferences();
        if (res.data) {
          setForm({
            bookingNotifications: !!res.data.bookingNotifications,
            ticketNotifications: !!res.data.ticketNotifications,
            systemNotifications: !!res.data.systemNotifications,
          });
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load preferences");
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, []);

  const handleToggle = (field) => {
    setForm((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await saveMyNotificationPreferences(form);
      toast.success("Notification preferences updated");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="space-y-8"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@700;800&display=swap');
      `}</style>

      <section className="rounded-3xl border border-orange-500/20 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-400 p-8 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/15 shadow-lg">
            <FiBell size={30} />
          </div>

          <div>
            <h1
              className="text-4xl font-bold"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Notification Preferences
            </h1>
            <p className="mt-2 text-orange-50 text-lg">
              Enable or disable categories of notifications
            </p>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="rounded-3xl border border-orange-500/20 bg-white/[0.04] py-16 text-center">
          <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-2 border-orange-500/30 border-t-orange-400" />
          <p className="text-zinc-400">Loading preferences...</p>
        </div>
      ) : (
        <section className="space-y-5">
          <PreferenceCard
            icon={<FiCalendar size={22} />}
            title="Booking Notifications"
            desc="Receive alerts for booking approval, rejection, and booking-related updates."
            checked={form.bookingNotifications}
            onToggle={() => handleToggle("bookingNotifications")}
          />

          <PreferenceCard
            icon={<FiTool size={22} />}
            title="Ticket Notifications"
            desc="Receive alerts for ticket status changes, comments, and assigned ticket updates."
            checked={form.ticketNotifications}
            onToggle={() => handleToggle("ticketNotifications")}
          />

          <PreferenceCard
            icon={<FiSettings size={22} />}
            title="System Notifications"
            desc="Receive announcements and important system-wide updates."
            checked={form.systemNotifications}
            onToggle={() => handleToggle("systemNotifications")}
          />

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 px-7 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02] disabled:opacity-60"
            >
              <FiSave size={16} />
              {saving ? "Saving..." : "Save Preferences"}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}