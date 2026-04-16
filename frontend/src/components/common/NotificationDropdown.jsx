import { Link } from "react-router-dom";
import {
  FiBell,
  FiCalendar,
  FiTool,
  FiSettings,
  FiTrash2,
  FiCheckCircle,
  FiX,
  FiAlertCircle
} from "react-icons/fi";

function getNotificationStyle(type) {
  if (!type) {
    return {
      badge: "bg-slate-500/10 text-slate-300 border-slate-500/20",
      icon: <FiBell size={16} />,
      iconBox: "bg-slate-500/10 text-slate-300",
      label: "Notification",
    };
  }

  if (type.startsWith("BOOKING")) {
    return {
      badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
      icon: <FiCalendar size={16} />,
      iconBox: "bg-emerald-500/10 text-emerald-300",
      label: "Booking",
    };
  }

  if (type.startsWith("TICKET")) {
    return {
      badge: "bg-orange-500/10 text-orange-300 border-orange-500/20",
      icon: <FiTool size={16} />,
      iconBox: "bg-orange-500/10 text-orange-300",
      label: "Ticket",
    };
  }

  if (type === "SYSTEM") {
    return {
      badge: "bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/20",
      icon: <FiAlertCircle size={16} />,
      iconBox: "bg-gradient-to-br from-fuchsia-500/20 to-purple-500/20 text-fuchsia-300",
      label: "System Update",
    };
  }

  return {
    badge: "bg-slate-500/10 text-slate-300 border-slate-500/20",
    icon: <FiBell size={16} />,
    iconBox: "bg-slate-500/10 text-slate-300",
    label: "Notification",
  };
}

function formatDate(dateString) {
  if (!dateString) return "Just now";

  try {
    return new Date(dateString).toLocaleString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "Just now";
  }
}

export default function NotificationDropdown({
  notifications,
  loading,
  onMarkRead,
  onDelete,
  preferencesPath,
  onClose,
}) {
  return (
    <div className="absolute right-0 top-14 z-50 w-[380px] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div>
          <h3 className="text-base font-bold text-white">Notifications</h3>
          <p className="text-xs text-zinc-500">
            Real-time updates from the system
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white"
        >
          <FiX size={16} />
        </button>
      </div>

      <div className="max-h-[430px] overflow-y-auto">
        {loading ? (
          <div className="px-5 py-10 text-center">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-orange-500/30 border-t-orange-400" />
            <p className="text-sm text-zinc-500">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <FiBell className="mx-auto mb-3 text-zinc-700" size={26} />
            <p className="font-semibold text-zinc-300">No notifications yet</p>
            <p className="mt-1 text-sm text-zinc-500">
              New activity will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3 p-4">
            {notifications.map((notification) => {
              const style = getNotificationStyle(notification.type);

              return (
                <div
                  key={notification.id}
                  className={`rounded-2xl border p-4 transition ${
                    notification.type === "SYSTEM"
                      ? "border-fuchsia-500/20 bg-gradient-to-r from-fuchsia-500/10 via-purple-500/10 to-indigo-500/10 shadow-lg shadow-fuchsia-500/5"
                      : notification.isRead
                      ? "border-white/10 bg-white/[0.03]"
                      : "border-orange-500/20 bg-orange-500/5"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl ${style.iconBox}`}
                    >
                      {style.icon}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${style.badge}`}
                        >
                          {style.label}
                        </span>

                        {!notification.isRead && (
                          <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-white">
                            NEW
                          </span>
                        )}
                      </div>

                      <p className="mt-2 text-sm font-medium leading-6 text-white">
                        {notification.message}
                      </p>

                      <p className="mt-2 text-[11px] text-zinc-500">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-end gap-2">
                    {!notification.isRead && (
                      <button
                        type="button"
                        onClick={() => onMarkRead(notification.id)}
                        className="inline-flex items-center gap-1 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/20"
                      >
                        <FiCheckCircle size={13} />
                        Mark Read
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onDelete(notification.id)}
                      className="inline-flex items-center gap-1 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/20"
                    >
                      <FiTrash2 size={13} />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="border-t border-white/10 p-4">
        <Link
          to={preferencesPath}
          onClick={onClose}
          className="flex items-center justify-center gap-2 rounded-2xl border border-orange-500/20 bg-orange-500/10 px-4 py-3 text-sm font-semibold text-orange-300 transition hover:bg-orange-500/20"
        >
          <FiSettings size={15} />
          Notification Preferences
        </Link>
      </div>
    </div>
  );
}