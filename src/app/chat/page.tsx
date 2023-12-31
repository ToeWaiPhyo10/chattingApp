"use client";
import { useUser } from "@clerk/nextjs";
import { Chat, LoadingIndicator, Streami18n } from "stream-chat-react";
import ChatSideBar from "./chatSideBar";
import useInitializeChatClient from "./useInitializeChatClient";
import ChatChannel from "./chatChannel";
import { useCallback, useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import useWindowSize from "@/hooks/useWindowSize";
import { mdBreakPoint } from "@/utils/tailwind";
import { useTheme } from "../ThemeProvider";
import { registerServerWorker } from "@/utils/serviceWorker";
import {
  getCurrentPushSubscription,
  sendPushSubscriptionToServer,
} from "@/notifications/pushService";
import PushMessageListener from "./pushMessageListener";

// const userId = "user_2UmhcCEdPiFOopLAHQPusH3d2EB";
// const chatClient = StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_KEY!);
// chatClient.connectUser(
//   { id: userId, name: "ToeWai" },
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNlcl8yVW1oY0NFZFBpRk9vcExBSFFQdXNIM2QyRUIifQ.vRJ_fjv2wgo2NCkjpMcYlNCH4zC4NBvf21rFEjJWNlM"
// );
// const channel = chatClient.channel("messaging", "channel_1", {
//   name: "Channel #1",
//   members: [userId],
// });
interface ChatPageProps {
  searchParams: { channelId?: string };
}
const i18Instance = new Streami18n({ language: "en" });
export default function ChatPage({
  searchParams: { channelId },
}: ChatPageProps) {
  const chatClient = useInitializeChatClient();
  const [chatSideBarOpen, setChatSideBarOpen] = useState(false);
  const windowSize = useWindowSize();
  const isLargeScreen = windowSize.width >= mdBreakPoint;
  const { user } = useUser();
  const { theme } = useTheme();
  useEffect(() => {
    if (windowSize.width > mdBreakPoint) setChatSideBarOpen(false);
  }, [windowSize.width]);

  useEffect(() => {
    async function setUpServiceWorker() {
      try {
        await registerServerWorker();
      } catch (error) {
        console.error(error);
      }
    }
    setUpServiceWorker();
  }, []);
  useEffect(() => {
    async function syncPushSubscription() {
      try {
        const subscription = await getCurrentPushSubscription();
        if (subscription) {
          await sendPushSubscriptionToServer(subscription);
        }
      } catch (error) {
        console.error(error);
      }
    }
    syncPushSubscription();
  }, []);

  useEffect(() => {
    if (channelId) {
      history.replaceState(null, "", "/chat");
    }
  }, [channelId]);
  const handleSidebarOnClose = useCallback(() => {
    setChatSideBarOpen(false);
  }, []);

  if (!user || !chatClient) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-black">
        <LoadingIndicator size={40} />
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100 text-black dark:bg-black dark:text-white xl:px-20 xl:py-8">
      <div className="m-auto flex h-full min-w-[350px] max-w-[1600px] flex-col shadow-sm">
        <Chat
          client={chatClient}
          theme={
            theme == "dark" ? "str-chat__theme-dark" : "str-chat__theme-light"
          }
          i18nInstance={i18Instance}
        >
          <div className="flex justify-center border-b border-b-[#dbdde1] p-3 md:hidden">
            <button onClick={() => setChatSideBarOpen(!chatSideBarOpen)}>
              {!chatSideBarOpen ? (
                <span className="flex items-center gap-1">
                  <Menu />
                  Menu
                </span>
              ) : (
                <X />
              )}
            </button>
          </div>
          <div className="flex h-full flex-row overflow-auto">
            <ChatSideBar
              user={user}
              show={isLargeScreen || chatSideBarOpen}
              onClose={handleSidebarOnClose}
              customActiveChannel={channelId}
            />

            <ChatChannel
              show={isLargeScreen || !chatSideBarOpen}
              hideChannelOnThread={!isLargeScreen}
            />
          </div>
          <PushMessageListener />
        </Chat>
      </div>
      {/* This is the Chat
      <UserButton afterSignOutUrl="/" /> */}
    </div>
  );
}
