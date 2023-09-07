import { UserButton } from "@clerk/nextjs";
import { BellOffIcon, BellRing, Moon, Sun, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTheme } from "../ThemeProvider";
import { dark } from "@clerk/themes";
import {
  getCurrentPushSubscription,
  registerPushNotifications,
  unregisterPushNotifications,
} from "@/notifications/pushService";
import { LoadingIndicator } from "stream-chat-react";
import DisappearingMessage from "@/components/disappearingMessage";
interface MenuBarProps {
  onUserManualClick: () => void;
}

export default function MenuBar({ onUserManualClick }: MenuBarProps) {
  const { theme } = useTheme();
  return (
    <div className="flex flex-row items-center justify-between gap-3 border-e border-e-[#dbdde1] bg-white p-3 dark:border-e-gray-800 dark:bg-[#17191c]">
      <UserButton
        afterSignOutUrl="/"
        appearance={{ baseTheme: theme == "dark" ? dark : undefined }}
      />
      <div className="flex gap-6">
        <PushSubscriptionToggleButton />
        <span title="Show users">
          <Users className="cursor-pointer" onClick={onUserManualClick} />
        </span>
        <ThemeToggleButton />
      </div>
    </div>
  );
}
function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();
  if (theme === "dark") {
    return (
      <span title="Switch to light theme">
        <Sun className="cursor-pointer" onClick={() => setTheme("light")} />
      </span>
    );
  }
  return (
    <span title="Switch to dark theme">
      <Moon className="cursor-pointer" onClick={() => setTheme("dark")} />
    </span>
  );
}
function PushSubscriptionToggleButton() {
  const [hasActivePushSubscription, setHasActivePushSubscription] =
    useState<boolean>();
  const [loading, setLoading] = useState<boolean>(false);
  const [confirmationMessage, setConfirmationMessage] = useState<string>();
  useEffect(() => {
    async function getActivePushSubscription() {
      const subscription = await getCurrentPushSubscription();
      setHasActivePushSubscription(!!subscription);
    }
    getActivePushSubscription();
  }, []);
  async function setPushNotifcationEnabled(enabled: boolean) {
    if (loading) return;
    setLoading(true);
    setConfirmationMessage(undefined);
    try {
      if (enabled) {
        await registerPushNotifications();
      } else {
        await unregisterPushNotifications();
      }
      setConfirmationMessage(
        "Push Notifications " + (enabled ? "enabled." : "disabled.")
      );
      setHasActivePushSubscription(enabled);
    } catch (error) {
      console.error(error);
      if (enabled && Notification.permission === "denied") {
        alert("Please enable push notification in your brower setting");
      } else {
        alert("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }
  if (hasActivePushSubscription === undefined) return null;
  return (
    <div className="relative">
      {loading && (
        <span className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <LoadingIndicator />
        </span>
      )}
      {confirmationMessage && (
        <DisappearingMessage className="absolute left-1/2 top-8 z-10 -translate-x-1/2 rounded-lg bg-white px-2 py-1 shadow-md dark:bg-black">
          {confirmationMessage}
        </DisappearingMessage>
      )}
      {hasActivePushSubscription ? (
        <span title="Disable push subscriptions on this device">
          <BellOffIcon
            onClick={() => setPushNotifcationEnabled(false)}
            className={`${loading ? "opacity-10" : ""}`}
          />
        </span>
      ) : (
        <span title="Enable push subscriptions on this device">
          <BellRing
            onClick={() => setPushNotifcationEnabled(true)}
            className={`${loading ? "opacity-10" : ""}`}
          />
        </span>
      )}
    </div>
  );
}
