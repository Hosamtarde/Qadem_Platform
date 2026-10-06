"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getUnreadCount,
  listNotifications,
  markAllAsRead,
  markAsRead,
  type Notification,
} from "@/lib/notifications";

const POLL_MS = 45_000;

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function NotificationBell() {
  const router = useRouter();
  const [count, setCount] = useState(0);
  const [items, setItems] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const refreshCount = useCallback(async () => {
    try {
      setCount(await getUnreadCount());
    } catch {
      // Silent: a failed poll should never interrupt the page.
    }
  }, []);

  useEffect(() => {
    void refreshCount();
    const id = setInterval(() => void refreshCount(), POLL_MS);
    return () => clearInterval(id);
  }, [refreshCount]);

  useEffect(() => {
    if (!open) return;

    function onClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  async function toggle() {
    const next = !open;
    setOpen(next);
    if (!next) return;

    setLoading(true);
    try {
      setItems(await listNotifications(10));
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  async function openItem(item: Notification) {
    setOpen(false);

    if (!item.isRead) {
      setCount((c) => Math.max(0, c - 1));
      setItems((list) =>
        list.map((n) => (n.id === item.id ? { ...n, isRead: true } : n)),
      );
      void markAsRead(item.id).catch(() => void refreshCount());
    }

    if (item.link) router.push(item.link);
  }

  async function readAll() {
    setCount(0);
    setItems((list) => list.map((n) => ({ ...n, isRead: true })));
    void markAllAsRead().catch(() => void refreshCount());
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={toggle}
        aria-label={
          count > 0 ? `${count} unread notifications` : "Notifications"
        }
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted transition hover:bg-panel-2 hover:text-text"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>

        {count > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold text-white shadow-[0_0_10px_rgba(46,116,181,0.8)]">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-[25rem] overflow-hidden rounded-2xl border border-line bg-panel shadow-2xl">
          <div className="flex items-center justify-between px-5 pb-3 pt-4">
            <div className="flex items-center gap-2">
              <h3 className="text-[15px] font-semibold tracking-tight text-text">
                Notifications
              </h3>
              {count > 0 && (
                <span className="rounded-full bg-brand/15 px-2 py-0.5 text-[11px] font-semibold text-brand">
                  {count}
                </span>
              )}
            </div>
            {count > 0 && (
              <button
                onClick={readAll}
                className="text-xs font-medium text-muted transition hover:text-brand"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="h-px bg-line" />

          <div className="max-h-[26rem] overflow-y-auto">
            {loading && (
              <p className="px-5 py-10 text-center text-sm text-muted">
                Loading
              </p>
            )}

            {!loading && items.length === 0 && (
              <div className="px-6 py-12 text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-panel-2">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted"
                  >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-text">All caught up</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  Updates on your applications will show up here.
                </p>
              </div>
            )}

            {!loading &&
              items.map((item) => {
                const isStatus = item.type === "APPLICATION_STATUS_CHANGED";
                return (
                  <button
                    key={item.id}
                    onClick={() => openItem(item)}
                    className="group relative flex w-full items-start gap-3.5 border-b border-line/50 px-5 py-4 text-left transition last:border-0 hover:bg-panel-2"
                  >
                    {!item.isRead && (
                      <span className="absolute left-0 top-1/2 h-8 w-[3px] -translate-y-1/2 rounded-r-full bg-brand" />
                    )}

                    <span
                      className={
                        item.isRead
                          ? "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-panel-2 text-muted"
                          : "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-brand ring-1 ring-brand/20"
                      }
                    >
                      {isStatus ? (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      ) : (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M19 8v6M22 11h-6" />
                        </svg>
                      )}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span
                          className={
                            item.isRead
                              ? "text-[10px] font-bold uppercase tracking-wider text-muted/60"
                              : "text-[10px] font-bold uppercase tracking-wider text-brand"
                          }
                        >
                          {isStatus ? "Status update" : "New applicant"}
                        </span>
                        <span className="text-[10px] text-muted/40">
                          {timeAgo(item.createdAt)}
                        </span>
                      </span>

                      <span
                        className={
                          item.isRead
                            ? "mt-1 block text-sm leading-snug text-muted"
                            : "mt-1 block text-sm font-semibold leading-snug text-text"
                        }
                      >
                        {item.title}
                      </span>

                      {item.body && (
                        <span className="mt-1 block text-xs leading-relaxed text-muted/70">
                          {item.body}
                        </span>
                      )}
                    </span>

                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      className="mt-3 shrink-0 text-muted/0 transition-all group-hover:translate-x-0.5 group-hover:text-brand"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}