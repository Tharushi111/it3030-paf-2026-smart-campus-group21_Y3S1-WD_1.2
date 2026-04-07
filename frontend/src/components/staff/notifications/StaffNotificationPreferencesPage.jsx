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
} from "../../../services/notificationService";

function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative h-7 w-14 rounded-full transition ${
        checked ? "bg-orange-500" : "bg-slate-300"
      }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
          checked ? "left-8" : "left-1"
        }`}
      />
    </button>
  );
}

function PreferenceCard({ icon, title, desc, checked, onToggle }) {
  return (
    <div className="rounded-3xl border border-orange-200 bg-white p-5 shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 text-white shadow-md">
            {icon}
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-800">{title}</h3>
            <p className="mt-1 text-sm text-slate-500">{desc}</p>
          </div>
        </div>

        <ToggleSwitch checked={checked} onChange={onToggle} />
      </div>
    </div>
  );
}

export default function StaffNotificationPreferencesPage() {
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
    <div className="space-y-8">
      <div className="rounded-3xl border border-orange-200 bg-white p-8 shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 text-white shadow-md">
            <FiBell size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Notification Preferences
            </h1>
            <p className="mt-1 text-slate-500">
              Manage alerts for staff workflow updates
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-orange-200 bg-white py-12 text-center shadow-sm">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-orange-500/30 border-t-orange-500" />
          <p className="text-slate-500">Loading preferences...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <PreferenceCard
            icon={<FiCalendar size={20} />}
            title="Booking Notifications"
            desc="Receive alerts for booking-related events relevant to your role."
            checked={form.bookingNotifications}
            onToggle={() => handleToggle("bookingNotifications")}
          />

          <PreferenceCard
            icon={<FiTool size={20} />}
            title="Ticket Notifications"
            desc="Receive alerts for assigned tickets, ticket comments, and status-related updates."
            checked={form.ticketNotifications}
            onToggle={() => handleToggle("ticketNotifications")}
          />

          <PreferenceCard
            icon={<FiSettings size={20} />}
            title="System Notifications"
            desc="Receive important platform-wide notices and system updates."
            checked={form.systemNotifications}
            onToggle={() => handleToggle("systemNotifications")}
          />

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-[1.02] disabled:opacity-60"
            >
              <FiSave size={16} />
              {saving ? "Saving..." : "Save Preferences"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}