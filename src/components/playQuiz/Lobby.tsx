import Background from "@ui/Background";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { useGameStore } from "@utils/zustand/gameStore";
import { socket } from "@utils/websocket/socket";
import Chat from "./Chat";
import TeamCard from "./TeamCard";
import NavBar from "./NavBar";
import JoinForm from "./JoinForm";
import InformationCard from "./InformationCard";

export interface IPlayer {
  id: string;
  name: string;
  team: string | null;
}

interface ITeam {
  id: string;
  players: IPlayer[];
  name: string;
}

interface ILobby {
  id: string;
  teams: ITeam[];
  players: IPlayer[];
  quizMaster: { id: string; name: string };
  quizName: string;
  numOfQuestions: string;
}

export interface IMessage {
  message: string;
  sender: string;
}

const Lobby = () => {
  const router = useRouter();
  const [lobby, setLobby] = useState<ILobby>();
  const [user, setUser] = useState<{
    id?: string;
    name?: string;
    team: string | null;
  }>();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [teamMessages, setTeamMessages] = useState<IMessage[]>([]);
  const [numOfUnreadMessages, setNumOfUnreadMessages] = useState(0);
  const [currentTab, setCurrentTab] = useState("global");
  const [wasKicked, setWasKicked] = useState(false);

  const userName = useGameStore((state) => state.userName);
  const socketId = useGameStore((state) => state.socketId);
  const quizName = useGameStore((state) => state.quizName);
  const numOfQuestions = useGameStore((state) => state.numOfQuestions);
  const numOfTeams = useGameStore((state) => state.numOfTeams);
  const isQuizMaster = !!(userName && socketId);

  const colors = ["#991b1b", "#1e40af", "#166534", "#6b21a8", "#854d0e"];

  useEffect(() => {
    if (userName && socketId && quizName && numOfQuestions) {
      setUser({ id: socketId, name: userName, team: null });

      const lobby = {
        id: router.query.id as string,
        players: [] as IPlayer[],
        quizMaster: { id: socketId, name: userName },
        teams: [] as ITeam[],
        numOfQuestions: numOfQuestions,
        quizName: quizName,
      };

      for (let i = 0; i < numOfTeams; i++) {
        lobby.teams.push({
          id: i.toString(),
          players: [],
          name: `Team ${i + 1}`,
        });
      }

      setLobby(lobby);
    }

    const onLobbyJoin = (data: ILobby, message: IMessage) => {
      setLobby(data);
      setMessages((oldMessages) => [...oldMessages, message]);
    };

    const onTeamJoin = (data: ILobby) => {
      setLobby(data);
    };

    const onTeamNameEdited = (data: ILobby) => {
      setLobby(data);
    };

    const onGlobalMessage = (message: IMessage) => {
      setMessages((oldMessages) => [...oldMessages, message]);
      if (currentTab !== "global") {
        setNumOfUnreadMessages(numOfUnreadMessages + 1);
      }
    };

    const onTeamMessage = (message: IMessage) => {
      setTeamMessages((oldMessages) => [...oldMessages, message]);
      if (currentTab !== "team") {
        setNumOfUnreadMessages(numOfUnreadMessages + 1);
      }
    };

    const onPlayerDisconnect = (data: { lobby: ILobby; socketId: string }) => {
      setLobby(data.lobby);
      if (socket.id === data.socketId) {
        setWasKicked(true);
      }
    };

    const onTeamsReset = (data: ILobby) => {
      setUser((user) => ({ ...user, team: null }));
      setLobby(data);
    };

    const onTeamsRandomized = (data: ILobby) => {
      if (!isQuizMaster) {
        const playerIndex = data.players.findIndex(
          (player) => player.id === socket.id
        );

        setUser((user) => ({
          ...user,
          team: data.players[playerIndex]!.team,
        }));
      }
      setLobby(data);
    };

    socket.on("joined-lobby", onLobbyJoin);
    socket.on("joined-team", onTeamJoin);
    socket.on("global-message-received", onGlobalMessage);
    socket.on("team-message-received", onTeamMessage);
    socket.on("team-name-edited", onTeamNameEdited);
    socket.on("player-disconnect", onPlayerDisconnect);
    socket.on("teams-reset", onTeamsReset);
    socket.on("teams-randomized", onTeamsRandomized);

    return () => {
      socket.off("joined-lobby", onLobbyJoin);
      socket.off("joined-team", onTeamJoin);
      socket.off("global-message-received", onGlobalMessage);
      socket.off("team-message-received", onTeamMessage);
      socket.off("team-name-edited", onTeamNameEdited);
      socket.off("player-disconnect", onPlayerDisconnect);
      socket.off("teams-reset", onTeamsReset);
      socket.off("teams-randomized", onTeamsRandomized);
    };
  }, [currentTab, numOfUnreadMessages]);

  return (
    <>
      {user ? (
        wasKicked ? (
          <div className="mx-auto flex h-screen w-1/4 flex-col justify-center gap-4">
            You were kicked by the quiz master
          </div>
        ) : (
          <div className="mx-auto flex h-screen w-10/12 flex-col gap-2 py-4">
            <NavBar
              isQuizMaster={isQuizMaster}
              players={lobby?.players}
              userName={user.name}
            />
            <div className="grid h-full w-full grid-flow-col grid-cols-6 grid-rows-3 gap-4 overflow-clip">
              <Background className="col-span-2 col-start-3 row-span-2">
                <InformationCard
                  isQuizMaster={isQuizMaster}
                  numOfQuestions={lobby?.numOfQuestions}
                  quizMaster={lobby?.quizMaster}
                  quizName={lobby?.quizName}
                />
              </Background>
              <Background className="col-span-2 col-start-5 row-span-1 row-start-2">
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
                          <div className="absolute -top-2 -right-7 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-sm font-bold text-white">
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
                            <div className="absolute -top-2 -right-7 inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
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
                        router.query.id && user.team
                          ? router.query.id + user.team
                          : ""
                      }
                    />
                  </Tabs.Content>
                </Tabs.Root>
              </Background>
              <div className="col-start-1 col-end-7">
                <div className="flex h-full gap-4">
                  {lobby?.teams.map((team, i) => (
                    <TeamCard
                      key={`team_${i}`}
                      color={colors[i]!}
                      index={i.toString()}
                      isQuizMaster={isQuizMaster}
                      name={team.name}
                      players={team.players}
                      setTeamMessages={setTeamMessages}
                      setUser={setUser}
                      user={user}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      ) : (
        <JoinForm setUser={setUser} />
      )}
    </>
  );
};

export default Lobby;
