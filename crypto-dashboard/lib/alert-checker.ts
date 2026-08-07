import webpush from "web-push";
import { fetchPrices } from "./bitvavo";
import { addNotification, getAlerts, getPushSubscriptions, removePushSubscription } from "./alerts-store";
import { PriceAlert } from "./types";

function isThresholdHit(alert: PriceAlert, currentPrice: number): boolean {
  let compareValue: number;

  if (alert.thresholdType === "amount") {
    compareValue = currentPrice;
  } else {
    // percentage: vergelijk huidige afwijking t.o.v. het vaste referentiepunt
    compareValue = ((currentPrice - alert.referencePrice) / alert.referencePrice) * 100;
  }

  return alert.direction === "above" ? compareValue >= alert.thresholdValue : compareValue <= alert.thresholdValue;
}

function formatAlertMessage(alert: PriceAlert): string {
  const dirLabel = alert.direction === "above" ? "boven" : "onder";
  if (alert.thresholdType === "amount") {
    return `${alert.symbol} ${dirLabel} €${alert.thresholdValue.toLocaleString("nl-NL")}`;
  }
  const sign = alert.thresholdValue >= 0 ? "+" : "";
  return `${alert.symbol} ${sign}${alert.thresholdValue}% bereikt`;
}

function configureWebPush() {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!publicKey || !privateKey) return false;
  webpush.setVapidDetails("mailto:noreply@vaultline.app", publicKey, privateKey);
  return true;
}

async function sendPushToAll(title: string, body: string) {
  const configured = configureWebPush();
  if (!configured) return;

  const subscriptions = await getPushSubscriptions();
  await Promise.all(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: sub.keys },
          JSON.stringify({ title, body })
        );
      } catch (err: unknown) {
        // 410/404 betekent: abonnement is niet meer geldig, opruimen
        const statusCode = (err as { statusCode?: number })?.statusCode;
        if (statusCode === 410 || statusCode === 404) {
          await removePushSubscription(sub.endpoint);
        }
      }
    })
  );
}

export interface CheckAlertsResult {
  checked: number;
  triggered: number;
}

/**
 * Vergelijkt alle actieve alerts met live prijzen. Bij een treffer:
 * - maakt een notificatie aan (voor het dashboard-paneel)
 * - stuurt een push-melding als het kanaal dat toestaat
 * Alerts blijven na afgaan actief (kunnen opnieuw triggeren).
 */
export async function checkAlerts(): Promise<CheckAlertsResult> {
  const alerts = await getAlerts();
  const activeAlerts = alerts.filter((a) => a.active);
  if (activeAlerts.length === 0) {
    return { checked: 0, triggered: 0 };
  }

  const symbols = [...new Set(activeAlerts.map((a) => a.symbol))];
  const prices = await fetchPrices(symbols);

  let triggered = 0;

  for (const alert of activeAlerts) {
    const priceInfo = prices[alert.symbol];
    if (!priceInfo) continue;

    if (isThresholdHit(alert, priceInfo.price)) {
      triggered++;
      const message = formatAlertMessage(alert);

      await addNotification({
        alertId: alert.id,
        symbol: alert.symbol,
        message,
        priceAtTrigger: priceInfo.price,
      });

      if (alert.channel === "push" || alert.channel === "both") {
        await sendPushToAll(
          "Vaultline",
          `${message} — nu €${priceInfo.price.toLocaleString("nl-NL")}`
        );
      }
    }
  }

  return { checked: activeAlerts.length, triggered };
}
