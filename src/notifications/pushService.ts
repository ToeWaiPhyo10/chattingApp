import { env } from "@/env";
import { getReadyServiceWorker } from "@/utils/serviceWorker";

export async function getCurrentPushSubscription(): Promise<PushSubscription | null> {
  const sw = await getReadyServiceWorker();
  return sw.pushManager.getSubscription();
}
export async function registerPushNotifications() {
  if (!("PushManager" in window)) {
    throw Error("Push notification are not supported by this browser");
  }
  const exisitingSubscription = await getCurrentPushSubscription();
  if (exisitingSubscription) {
    throw Error("Exisiting push subscription found");
  }
  const sw = await getReadyServiceWorker();
  const subscription = await sw.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
  });
  await sendPushSubscriptionToServer(subscription);
}

export async function unregisterPushNotifications() {
  const exisitingSubscription = await getCurrentPushSubscription();
  if (!exisitingSubscription) {
    throw Error("No Exisiting push notification found");
  }
  await deletePushSubscriptionFromServer(exisitingSubscription);
  await exisitingSubscription.unsubscribe();
}

export async function sendPushSubscriptionToServer(
  subscription: PushSubscription
) {
  const response = await fetch("/api/register-push", {
    method: "POST",
    body: JSON.stringify(subscription),
  });

  if (!response.ok) {
    throw Error("Failed to send notification to Server");
  }
}

export async function deletePushSubscriptionFromServer(
  subscription: PushSubscription
) {
  const response = await fetch("/api/register-push", {
    method: "DELETE",
    body: JSON.stringify(subscription),
  });

  if (!response.ok) {
    throw Error("Failed to send notification to Server");
  }
}
