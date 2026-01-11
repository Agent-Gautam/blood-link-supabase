"use client";

import { useState, useEffect, useTransition } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Check,
  Info,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Notification } from "@/app/types";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/app/notifications/actions";
import NotificationDrawerSkeleton from "./notification-drawer-skeleton";
import { useRouter } from "next/navigation";

export default function NotificationDrawer() {
  const [open, setOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    if (open) {
      loadNotifications();
    }
  }, [open]);

  const loadNotifications = async () => {
    setLoading(true);
    const result = await fetchNotifications();
    if (result.success && result.data) {
      setNotifications(result.data);
    }
    setLoading(false);
  };

  const handleMarkAsRead = async (
    notificationId: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    startTransition(async () => {
      const result = await markNotificationAsRead(notificationId);
      if (result.success) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, is_read: true } : n
          )
        );
        router.refresh();
      }
    });
  };

  const handleMarkAllAsRead = async () => {
    startTransition(async () => {
      const result = await markAllNotificationsAsRead();
      if (result.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
        router.refresh();
      }
    });
  };

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification);
    if (!notification.is_read) {
      handleMarkAsRead(notification.id, {} as React.MouseEvent);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const getNotificationStyles = (type: string, isRead: boolean) => {
    const baseStyles = isRead
      ? "bg-muted/30 border-muted"
      : "border-2 shadow-sm";

    switch (type) {
      case "success":
        return {
          bg: isRead ? baseStyles : "bg-green-50/80 border-green-200",
          icon: "text-green-600",
          dot: "bg-green-600",
          iconComponent: <CheckCircle className="h-5 w-5" />,
        };
      case "warning":
        return {
          bg: isRead ? baseStyles : "bg-amber-50/80 border-amber-200",
          icon: "text-amber-600",
          dot: "bg-amber-600",
          iconComponent: <AlertTriangle className="h-5 w-5" />,
        };
      case "error":
        return {
          bg: isRead ? baseStyles : "bg-red-50/80 border-red-200",
          icon: "text-red-600",
          dot: "bg-red-600",
          iconComponent: <XCircle className="h-5 w-5" />,
        };
      default:
        return {
          bg: isRead ? baseStyles : "bg-blue-50/80 border-blue-200",
          icon: "text-blue-600",
          dot: "bg-blue-600",
          iconComponent: <Info className="h-5 w-5" />,
        };
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60)
      return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="relative hover:bg-white/20 transition-colors text-white"
        onClick={() => setOpen(true)}
        aria-label="Notifications"
      >
        <Bell
          className={`h-5 w-5 transition-colors ${
            unreadCount > 0 ? "text-white" : "text-white/80"
          }`}
        />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold animate-pulse shadow-lg ring-2 ring-white"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center justify-between">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {unreadCount} new
                </Badge>
              )}
            </SheetTitle>
            <SheetDescription>
              Stay updated with your activities
            </SheetDescription>
          </SheetHeader>

          <div className="h-[calc(100vh-120px)] mt-6 overflow-y-auto pr-2">
            {loading ? (
              <NotificationDrawerSkeleton />
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                <p className="text-muted-foreground font-medium">
                  No notifications
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  You're all caught up!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification, index) => {
                  const styles = getNotificationStyles(
                    notification.type,
                    notification.is_read
                  );
                  return (
                    <div key={notification.id}>
                      <div
                        onClick={() => handleNotificationClick(notification)}
                        className={`w-full text-left p-4 rounded-lg border transition-all hover:shadow-md hover:scale-[1.01] active:scale-[0.99] cursor-pointer ${styles.bg}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className={`shrink-0 mt-0.5 ${styles.icon}`}>
                              {styles.iconComponent}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start gap-2 mb-2">
                                {!notification.is_read && (
                                  <div
                                    className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${styles.dot}`}
                                  />
                                )}
                                <div className="flex-1 min-w-0">
                                  <p
                                    className={`font-semibold text-sm line-clamp-2 ${
                                      notification.is_read
                                        ? "text-muted-foreground"
                                        : "text-foreground"
                                    }`}
                                  >
                                    {notification.message.length > 100
                                      ? `${notification.message.substring(0, 100)}...`
                                      : notification.message}
                                  </p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <p className="text-xs text-muted-foreground">
                                      {formatTimestamp(notification.sent_at)}
                                    </p>
                                    <Badge
                                      variant="outline"
                                      className={`text-xs ${styles.icon} border-current`}
                                    >
                                      {notification.type}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          {!notification.is_read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 shrink-0"
                              onClick={(e) =>
                                handleMarkAsRead(notification.id, e)
                              }
                              disabled={isPending}
                            >
                              {isPending ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Check className="h-3 w-3" />
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                      {index < notifications.length - 1 && (
                        <Separator className="my-2" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {notifications.length > 0 && unreadCount > 0 && (
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-background">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleMarkAllAsRead}
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Marking...
                  </>
                ) : (
                  "Mark all as read"
                )}
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Notification Detail Dialog */}
      <Dialog
        open={!!selectedNotification}
        onOpenChange={(open) => !open && setSelectedNotification(null)}
      >
        <DialogContent className="max-w-2xl">
          {selectedNotification && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div
                    className={`shrink-0 ${
                      getNotificationStyles(
                        selectedNotification.type,
                        selectedNotification.is_read
                      ).icon
                    }`}
                  >
                    {
                      getNotificationStyles(
                        selectedNotification.type,
                        selectedNotification.is_read
                      ).iconComponent
                    }
                  </div>
                  <div className="flex-1">
                    <DialogTitle className="text-left">
                      Notification Details
                    </DialogTitle>
                    <DialogDescription className="text-left mt-1">
                      {formatTimestamp(selectedNotification.sent_at)} •{" "}
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          getNotificationStyles(
                            selectedNotification.type,
                            selectedNotification.is_read
                          ).icon
                        } border-current`}
                      >
                        {selectedNotification.type}
                      </Badge>
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <div className="mt-4">
                <p className="text-base leading-relaxed whitespace-pre-wrap">
                  {selectedNotification.message}
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
