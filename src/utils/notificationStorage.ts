import type { Notification } from "../types/Notification";

const NOTIFICATIONS_KEY = "supportflow-notifications";

export const getNotifications = (): Notification[] => {
  const storedNotifications = localStorage.getItem(NOTIFICATIONS_KEY);

  if (storedNotifications === null) {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([]));
    return [];
  }

  return JSON.parse(storedNotifications) as Notification[];
};

export const saveNotifications = (notifications: Notification[]): void => {
  localStorage.setItem(
    NOTIFICATIONS_KEY,
    JSON.stringify(notifications)
  );
};

export const addNotification = (notification: Notification): void => {
  const notifications = getNotifications();

  saveNotifications([notification, ...notifications]);
};

export const markNotificationAsRead = (notificationId: string): void => {
  const notifications = getNotifications();

  const updatedNotifications = notifications.map(notification =>
    notification.id === notificationId
      ? { ...notification, read: true }
      : notification
  );

  saveNotifications(updatedNotifications);
};

export const markAllNotificationsAsRead = (): void => {
  const notifications = getNotifications();

  const updatedNotifications = notifications.map(notification => ({
    ...notification,
    read: true,
  }));

  saveNotifications(updatedNotifications);
};