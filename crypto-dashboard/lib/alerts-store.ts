import { Redis } from "@upstash/redis";
import { randomUUID } from "crypto";
import { AlertNotification, PriceAlert } from "./types";

const redis = Redis.fromEnv();

const ALERTS_KEY = "vaultline:alerts";
const NOTIFICATIONS_KEY = "vaultline:notifications";
const PUSH_SUBSCRIPTIONS_KEY = "vaultline:push_subscriptions";

// ---- Alerts ----

export async function getAlerts(): Promise<PriceAlert[]> {
  const alerts = await redis.get<PriceAlert[]>(ALERTS_KEY);
  return alerts ?? [];
}

export async function createAlert(input: Omit<PriceAlert, "id" | "createdAt" | "active">): Promise<PriceAlert> {
  const alerts = await getAlerts();
  const alert: PriceAlert = {
    ...input,
    id: randomUUID(),
    active: true,
    createdAt: new Date().toISOString(),
  };
  await redis.set(ALERTS_KEY, [...alerts, alert]);
  return alert;
}

export async function updateAlert(id: string, updates: Partial<PriceAlert>): Promise<void> {
  const alerts = await getAlerts();
  const updated = alerts.map((a) => (a.id === id ? { ...a, ...updates } : a));
  await redis.set(ALERTS_KEY, updated);
}

export async function deleteAlert(id: string): Promise<void> {
  const alerts = await getAlerts();
  await redis.set(
    ALERTS_KEY,
    alerts.filter((a) => a.id !== id)
  );
}

// ---- Notifications ----

const MAX_NOTIFICATIONS = 100;

export async function getNotifications(): Promise<AlertNotification[]> {
  const list = await redis.get<AlertNotification[]>(NOTIFICATIONS_KEY);
  return list ?? [];
}

export async function addNotification(
  input: Omit<AlertNotification, "id" | "triggeredAt" | "status">
): Promise<AlertNotification> {
  const list = await getNotifications();
  const notification: AlertNotification = {
    ...input,
    id: randomUUID(),
    triggeredAt: new Date().toISOString(),
    status: "unread",
  };
  const updated = [notification, ...list].slice(0, MAX_NOTIFICATIONS);
  await redis.set(NOTIFICATIONS_KEY, updated);
  return notification;
}

export async function updateNotificationStatus(
  id: string,
  status: AlertNotification["status"]
): Promise<void> {
  const list = await getNotifications();
  const updated = list.map((n) => (n.id === id ? { ...n, status } : n));
  await redis.set(NOTIFICATIONS_KEY, updated);
}

// ---- Push subscriptions ----

export interface StoredPushSubscription {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}

export async function getPushSubscriptions(): Promise<StoredPushSubscription[]> {
  const list = await redis.get<StoredPushSubscription[]>(PUSH_SUBSCRIPTIONS_KEY);
  return list ?? [];
}

export async function addPushSubscription(sub: StoredPushSubscription): Promise<void> {
  const list = await getPushSubscriptions();
  const exists = list.some((s) => s.endpoint === sub.endpoint);
  if (!exists) {
    await redis.set(PUSH_SUBSCRIPTIONS_KEY, [...list, sub]);
  }
}

export async function removePushSubscription(endpoint: string): Promise<void> {
  const list = await getPushSubscriptions();
  await redis.set(
    PUSH_SUBSCRIPTIONS_KEY,
    list.filter((s) => s.endpoint !== endpoint)
  );
}
