import * as Tabs from "@radix-ui/react-tabs";
import Chat from "./Chat";
import { useRouter } from "next/router";
import { IMessage } from "./Lobby";
import { FC, useEffect, useState } from "react";
import { socket } from "@utils/websocket/socket";
import { useGameStore } from "@utils/zustand/gameStore";

const ChatCard = () => {
  const router = useRouter();
  const [numOfUnreadMessages, setNumOfUnreadMessages] = useState(0);
  const [currentTab, setCurrentTab] = useState("global");

  const user = useGameStore((state) => state.user);
  const messages = useGameStore((state) => state.messages);
  const teamMessages = useGameStore((state) => state.teamMessages);
  const addMessage = useGameStore((state) => state.addMessage);
  const resetMessages = useGameStore((state) => state.resetMessages);
  const addTeamMessage = useGameStore((state) => state.addTeamMessage);

  useEffect(() => {
    resetMessages();
  }, []);

  useEffect(() => {
    const onGlobalMessage = (message: IMessage) => {
      addMessage(message);
      if (currentTab !== "global") {
        setNumOfUnreadMessages(numOfUnreadMessages + 1);
      }
    };

    const onTeamMessage = (message: IMessage) => {
      addTeamMessage(message);
      if (currentTab !== "team") {
        setNumOfUnreadMessages(numOfUnreadMessages + 1);
      }
    };

    socket.on("global-message-received", onGlobalMessage);
    socket.on("team-message-received", onTeamMessage);

    return () => {
      socket.off("global-message-received", onGlobalMessage);
      socket.off("team-message-received", onTeamMessage);
    };
  }, [currentTab, numOfUnreadMessages, messages, teamMessages]);

  return (
    <Tabs.Root
      className="flex h-full flex-col p-2"
      value={currentTab}
      onValueChange={(val) => {
        setCurrentTab(val);
        setNumOfUnreadMessages(0);
      }}
    >
      <Tabs.List className="flex pb-2">
        <Tabs.Trigger
          className="relative flex w-full items-center justify-center border-b-purple-600 pb-1 text-lg font-bold data-[state=active]:border-b"
          value="global"
        >
          <div className="relative">
            Global
            {numOfUnreadMessages > 0 && currentTab !== "global" && (
              <div className="absolute -right-7 -top-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-sm font-bold text-white">
                {numOfUnreadMessages}
              </div>
            )}
          </div>
        </Tabs.Trigger>
        {user.team && (
          <Tabs.Trigger
            className="flex w-full items-center justify-center border-b-purple-600 pb-1 text-lg font-bold data-[state=active]:border-b"
            value="team"
          >
            <div className="relative">
              Team
              {numOfUnreadMessages > 0 && currentTab !== "team" && (
                <div className="absolute -right-7 -top-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {numOfUnreadMessages}
                </div>
              )}
            </div>
          </Tabs.Trigger>
        )}
      </Tabs.List>

      <Tabs.Content value="global" className="h-full overflow-clip">
        <Chat messages={messages} userName={user.name} />
      </Tabs.Content>

      <Tabs.Content value="team" className="h-full overflow-clip">
        <Chat
          messages={teamMessages}
          userName={user.name}
          roomId={
            router.query.id && user.team ? router.query.id + user.team : ""
          }
        />
      </Tabs.Content>
    </Tabs.Root>
  );
};

export default ChatCard;
