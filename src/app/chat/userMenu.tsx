import { UserResource } from "@clerk/types";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Channel, UserResponse } from "stream-chat";
import {
  Avatar,
  LoadingChannels as LoadingUsers,
  useChatContext,
} from "stream-chat-react";

interface UsersMenuProps {
  loggedInUser: UserResource;
  onClose: () => void;
  onChannelSelected: () => void;
}

export default function UsersMenu({
  loggedInUser,
  onClose,
  onChannelSelected,
}: UsersMenuProps) {
  const { client, setActiveChannel } = useChatContext();

  const [users, setUsers] = useState<(UserResponse & { image?: string })[]>();

  useEffect(() => {
    async function loadInitialUsers() {
      try {
        const response = await client.queryUsers(
          {
            id: { $ne: loggedInUser.id },
          },
          { id: 1 }
        );
        setUsers(response.users);
      } catch (error) {
        console.error(error);
        alert("Error loading users");
      }
    }
    loadInitialUsers();
  }, [client, loggedInUser.id]);

  function handleChannelSelected(channel: Channel) {
    setActiveChannel(channel);
    onChannelSelected();
  }

  async function startChatWithUser(userId: string) {
    try {
      const channel = client.channel("messaging", {
        members: [userId, loggedInUser.id],
      });
      await channel.create();
      handleChannelSelected(channel);
    } catch (error) {
      console.error(error);
      alert("Error creating channel");
    }
  }

  return (
    <div className="str-chat absolute z-10 h-full w-full border-e border-e-[#dbdde1] bg-white">
      <div className="flex items-center gap-3 p-3 text-lg font-bold">
        <ArrowLeft className="cursor-pointer" onClick={onClose} /> Users
      </div>
      <div>
        {!users && <LoadingUsers />}
        {users?.map((user) => (
          <UserResult
            user={user}
            onUserClicked={startChatWithUser}
            key={user.id}
          />
        ))}
      </div>
    </div>
  );
}

interface UserResultProps {
  user: UserResponse & { image?: string };
  onUserClicked: (userId: string) => void;
}

function UserResult({ user, onUserClicked }: UserResultProps) {
  return (
    <button
      className="mb-3 flex w-full items-center gap-2 p-2 hover:bg-[#e9eaed]"
      onClick={() => onUserClicked(user.id)}
    >
      <span>
        <Avatar image={user.image} name={user.name || user.id} size={40} />
      </span>
      <span className="overflow-hidden text-ellipsis whitespace-nowrap">
        {user.name || user.id}
      </span>
      {user.online && <span className="text-xs text-green-500">Online</span>}
    </button>
  );
}
