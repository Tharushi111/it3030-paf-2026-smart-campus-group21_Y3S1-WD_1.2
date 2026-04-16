import { useEffect, useMemo, useRef, useState } from "react";
import { FiBell } from "react-icons/fi";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import toast from "react-hot-toast";
import {
  getMyNotifications,
  markNotificationRead,
  deleteNotification,
} from "../../services/notificationService";
import NotificationDropdown from "./NotificationDropdown";

export default function NotificationBell({ user, preferencesPath }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const stompClientRef = useRef(null);
  const mountedRef = useRef(true);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const res = await getMyNotifications();
      if (mountedRef.current) {
        setNotifications(res.data || []);
      }
    } catch (error) {
      console.error("Failed to load notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  };

  const handleMarkRead = async (id) => {
    const target = notifications.find((n) => n.id === id);
    if (!target || target.isRead) return;

    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      toast.error("Failed to mark notification as read");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      toast.success("Notification deleted");
    } catch (error) {
      console.error("Failed to delete notification:", error);
      toast.error(error?.response?.data?.message || "Failed to delete notification");
    }
  };

  useEffect(() => {
    if (!user?.email) return;

    mountedRef.current = true;

    loadNotifications();

    if (stompClientRef.current) {
      stompClientRef.current.deactivate();
      stompClientRef.current = null;
    }

    const client = new Client({
      webSocketFactory: () =>
        new SockJS("http://localhost:9090/ws-notifications"),
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/topic/notifications/${user.email}`, (message) => {
          if (!mountedRef.current) return;

          try {
            const notification = JSON.parse(message.body);
            setNotifications((prev) => [notification, ...prev]);

            if (notification?.type === "SYSTEM") {
              toast.success("New system notification");
            }
          } catch (error) {
            console.error("Failed to parse websocket notification:", error);
          }
        });
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame.headers["message"]);
      },
      onWebSocketError: (error) => {
        console.error("WebSocket error:", error);
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      mountedRef.current = false;

      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        stompClientRef.current = null;
      }
    };
  }, [user?.email]);

  if (!user) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative rounded-xl border border-white/10 bg-white/5 p-2.5 text-zinc-300 transition-all duration-200 hover:border-orange-400/30 hover:bg-white/10 hover:text-orange-300 hover:scale-105"
        title="Notifications"
      >
        <FiBell size={18} />

        {unreadCount > 0 && (
          <>
            <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-lg ring-2 ring-slate-900">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
            <span className="absolute right-0 top-0 h-2.5 w-2.5 animate-ping rounded-full bg-red-400 ring-2 ring-slate-900" />
          </>
        )}
      </button>

      {open && (
        <NotificationDropdown
          notifications={notifications}
          loading={loading}
          onMarkRead={handleMarkRead}
          onDelete={handleDelete}
          preferencesPath={preferencesPath}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}