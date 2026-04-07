import { useEffect, useMemo, useRef } from "react";
import {
  FiBell,
  FiCheckCircle,
  FiCalendar,
  FiTool,
  FiMessageSquare,
  FiSettings,
} from "react-icons/fi";
import { Link } from "react-router-dom";

function timeAgo(dateString) {
  if (!dateString) return "Just now";

  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < minute) return "Just now";
  if (diffMs < hour) return `${Math.floor(diffMs / minute)} min ago`;
  if (diffMs < day) return `${Math.floor(diffMs / hour)} hr ago`;
  return `${Math.floor(diffMs / day)} day ago`;
}

function getNotificationIcon(type) {
  if (!type) return <FiBell size={15} />;

  if (type.includes("BOOKING")) {
    return <FiCalendar size={15} />;
  }

  if (type.includes("TICKET")) {
    return <FiTool size={15} />;
  }

  if (type.includes("SYSTEM")) {
    return <FiSettings size={15} />;
  }

  return <FiMessageSquare size={15} />;
}

function getNotificationIconClasses(type) {
  if (!type) {
    return "bg-orange-500/15 text-orange-300 border border-orange-500/20";
  }

  if (type.includes("BOOKING")) {
    return "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20";
  }

  if (type.includes("TICKET")) {
    return "bg-violet-500/15 text-violet-300 border border-violet-500/20";
  }

  if (type.includes("SYSTEM")) {
    return "bg-sky-500/15 text-sky-300 border border-sky-500/20";
  }

  return "bg-orange-500/15 text-orange-300 border border-orange-500/20";
}

export default function NotificationDropdown({
  notifications,
  loading,
  onMarkRead,
  preferencesPath,
  onClose,
}) {
  const panelRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-14 z-[80] w-[380px] overflow-hidden rounded-3xl border border-orange-500/20 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 shadow-2xl"
    >
      <div className="border-b border-white/10 px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Notifications</h3>
            <p className="text-xs text-zinc-500">
              {unreadCount} unread notification{unreadCount === 1 ? "" : "s"}
            </p>
          </div>

          <Link
            to={preferencesPath}
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-xl border border-orange-500/20 bg-orange-500/10 px-3 py-2 text-xs font-semibold text-orange-300 transition hover:bg-orange-500/20"
          >
            <FiSettings size={13} />
            Preferences
          </Link>
        </div>
      </div>

      <div className="max-h-[420px] overflow-y-auto">
        {loading ? (
          <div className="px-5 py-10 text-center">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-orange-500/30 border-t-orange-400" />
            <p className="text-sm text-zinc-500">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] text-zinc-500">
              <FiBell size={20} />
            </div>
            <p className="font-semibold text-zinc-300">No notifications yet</p>
            <p className="mt-1 text-sm text-zinc-500">
              New updates will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.06]">
            {notifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={() => onMarkRead(notification.id)}
                className={`w-full px-5 py-4 text-left transition hover:bg-white/[0.04] ${
                  notification.isRead ? "opacity-80" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl ${getNotificationIconClasses(
                      notification.type
                    )}`}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p
                        className={`text-sm ${
                          notification.isRead
                            ? "text-zinc-300"
                            : "font-semibold text-white"
                        }`}
                      >
                        {notification.message}
                      </p>

                      {!notification.isRead && (
                        <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-orange-400" />
                      )}
                    </div>

                    <div className="mt-2 flex items-center justify-between gap-3">
                      <span className="text-[11px] uppercase tracking-wide text-zinc-500">
                        {notification.type?.replaceAll("_", " ")}
                      </span>

                      <span className="text-xs text-zinc-500">
                        {timeAgo(notification.createdAt)}
                      </span>
                    </div>

                    {!notification.isRead && (
                      <div className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-emerald-300">
                        <FiCheckCircle size={12} />
                        Click to mark as read
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}