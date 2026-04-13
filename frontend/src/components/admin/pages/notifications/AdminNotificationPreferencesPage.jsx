import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FiBell,
  FiCalendar,
  FiTool,
  FiSettings,
  FiSave,
  FiSend,
  FiAlertCircle,
} from "react-icons/fi";
import {
  getMyNotificationPreferences,
  saveMyNotificationPreferences,
  sendSystemNotification,
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

  const [announcement, setAnnouncement] = useState("");
  const [sendingAnnouncement, setSendingAnnouncement] = useState(false);

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

  const handleSendAnnouncement = async () => {
    if (!announcement.trim()) {
      toast.error("Announcement message is required");
      return;
    }

    try {
      setSendingAnnouncement(true);
      await sendSystemNotification(announcement.trim());
      setAnnouncement("");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to send system notification");
    } finally {
      setSendingAnnouncement(false);
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
              Notification Center
            </h1>
            <p className="mt-2 text-orange-50 text-lg">
              Manage admin preferences and send system-wide announcements
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-fuchsia-500/20 bg-gradient-to-br from-fuchsia-500/10 via-purple-500/10 to-indigo-500/10 p-6 shadow-xl">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-purple-500 text-white shadow-lg">
            <FiAlertCircle size={24} />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              Send System Announcement
            </h2>
            <p className="text-sm text-zinc-300">
              Broadcast a special system notification to all active users
            </p>
          </div>
        </div>

        <textarea
          value={announcement}
          onChange={(e) => setAnnouncement(e.target.value)}
          rows="4"
          maxLength={500}
          placeholder="Example: CampusNexus system maintenance will happen tonight from 10:00 PM to 11:00 PM."
          className="w-full rounded-2xl border border-fuchsia-500/20 bg-white/[0.05] p-4 text-white placeholder:text-zinc-500 outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-500/20"
        />

        <div className="mt-3 flex items-center justify-between gap-4">
          <p className="text-xs text-zinc-400">
            This will appear to users as a special <span className="font-semibold text-fuchsia-300">SYSTEM</span> notification.
          </p>

          <button
            type="button"
            onClick={handleSendAnnouncement}
            disabled={sendingAnnouncement}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02] disabled:opacity-60"
          >
            <FiSend size={16} />
            {sendingAnnouncement ? "Sending..." : "Send Announcement"}
          </button>
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