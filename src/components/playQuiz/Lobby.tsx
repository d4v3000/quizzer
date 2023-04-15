import {
  CheckIcon,
  EyeIcon,
  EyeSlashIcon,
  FaceSmileIcon,
  PaperClipIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/solid";
import Background from "@ui/Background";
import Button from "@ui/Button";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as Tabs from "@radix-ui/react-tabs";
import { useGameStore } from "@utils/zustand/gameStore";
import { socket } from "@utils/websocket/socket";
import Label from "@ui/Label";
import { SubmitHandler, useForm } from "react-hook-form";
import Chat from "./Chat";
import PlayerBadge from "./PlayerBadge";
import NavButton from "./NavButton";
import * as Popover from "@radix-ui/react-popover";

interface IFormInputs {
  userName: string;
}

interface IPlayer {
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
  const baseUrl = "http://localhost:3000" || process.env.BASE_URL;
  const router = useRouter();
  const [showInviteLink, setShowInviteLink] = useState(false);
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
  const [isEditTeamName, setIsEditTeamName] = useState(-1);
  const [teamName, setTeamName] = useState("");
  const [wasKicked, setWasKicked] = useState(false);

  const userName = useGameStore((state) => state.userName);
  const socketId = useGameStore((state) => state.socketId);
  const quizName = useGameStore((state) => state.quizName);
  const numOfQuestions = useGameStore((state) => state.numOfQuestions);
  const numOfTeams = useGameStore((state) => state.numOfTeams);
  const isQuizMaster = !!(userName && socketId);

  const colors = ["#991b1b", "#1e40af", "#166534", "#6b21a8", "#854d0e"];

  const joinLobby = (data: IFormInputs) => {
    socket.emit(
      "join-lobby",
      {
        userName: data.userName,
        lobbyId: router.query.id,
      },
      (response: ILobby) => {
        setLobby(response);
      }
    );
    setUser({ id: socket.id, name: data.userName, team: null });
  };

  const joinTeam = (teamId: string) => {
    socket.emit(
      "join-team",
      {
        userName: user?.name,
        lobbyId: router.query.id,
        teamId: teamId,
        oldTeam: user?.team,
      },
      (response: ILobby) => {
        setLobby(response);
      }
    );
    setUser((user) => ({ ...user, team: teamId }));
    setTeamMessages([]);
  };

  const editTeamName = (teamId: string) => {
    socket.emit(
      "edit-team-name",
      {
        lobbyId: router.query.id,
        teamId: teamId,
        name: teamName,
      },
      (response: ILobby) => {
        setLobby(response);
      }
    );
  };

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

    socket.on("joined-lobby", onLobbyJoin);
    socket.on("joined-team", onTeamJoin);
    socket.on("global-message-received", onGlobalMessage);
    socket.on("team-message-received", onTeamMessage);
    socket.on("team-name-edited", onTeamNameEdited);
    socket.on("player-disconnect", onPlayerDisconnect);

    return () => {
      socket.off("joined-lobby", onLobbyJoin);
      socket.off("joined-team", onTeamJoin);
      socket.off("global-message-received", onGlobalMessage);
      socket.off("team-message-received", onTeamMessage);
      socket.off("team-name-edited", onTeamNameEdited);
      socket.off("player-disconnect", onPlayerDisconnect);
    };
  }, [currentTab, numOfUnreadMessages]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputs>();
  const onSubmit: SubmitHandler<IFormInputs> = (data) => joinLobby(data);

  return (
    <>
      {user ? (
        wasKicked ? (
          <div className="mx-auto flex h-screen w-1/4 flex-col justify-center gap-4">
            You were kicked by the quiz master
          </div>
        ) : (
          <div className="mx-auto flex h-screen w-10/12 flex-col gap-2 py-4">
            <div className="flex w-full justify-between">
              <div className="flex items-center gap-2">
                <Popover.Root>
                  <Popover.Trigger asChild>
                    <NavButton>
                      Players <UserIcon className="h-5 w-5" />{" "}
                      {lobby?.players.length}
                    </NavButton>
                  </Popover.Trigger>
                  <Popover.Portal>
                    <Popover.Content
                      className="rounded-md bg-zinc-300 p-5 data-[state=open]:animate-slideDownAndFade"
                      sideOffset={5}
                      align="start"
                    >
                      <div className="flex w-full flex-col gap-2">
                        <p className="text-xl font-semibold">
                          Players in this room:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {lobby?.players.map((player) => (
                            <PlayerBadge
                              name={player.name}
                              id={player.id}
                              isQuizMaster={isQuizMaster}
                              key={`playerList_${player.id}`}
                              className="bg-gray-600 text-white"
                            />
                          ))}
                        </div>
                        {isQuizMaster && (
                          <>
                            <Button
                              intent="secondary"
                              size="large"
                              className="bg-gray-600"
                            >
                              Randomize Teams
                            </Button>
                            <Button
                              intent="secondary"
                              size="large"
                              className="bg-gray-600"
                            >
                              Reset Teams
                            </Button>
                          </>
                        )}
                      </div>
                    </Popover.Content>
                  </Popover.Portal>
                </Popover.Root>
              </div>
              <div className="flex items-center gap-2">
                <NavButton>Rules</NavButton>
                <NavButton>
                  {user.name} <FaceSmileIcon className="h-5 w-5" />
                </NavButton>
              </div>
            </div>
            <div className="grid h-full w-full grid-flow-col grid-cols-6 grid-rows-3 gap-4">
              <Background className="col-span-2 col-start-3 row-span-2">
                <div className="flex h-full flex-col items-center justify-between p-4">
                  <div className="flex w-full flex-col items-center gap-3">
                    <h1 className="text-3xl font-extrabold">
                      {lobby?.quizName}
                    </h1>
                    <h2 className="text-xl font-bold">
                      presentend to you by: {lobby?.quizMaster.name}
                      {lobby?.quizMaster.id === socket.id ? " (You)" : ""}
                    </h2>
                    <h3>
                      You can expect {lobby?.numOfQuestions} Questions this
                      evening
                    </h3>
                  </div>
                  {isQuizMaster && <Button size="large">Start Game</Button>}
                  <div className="flex w-1/2 cursor-pointer items-center rounded-2xl border border-zinc-200">
                    <div
                      className={`${
                        showInviteLink ? "cursor-text" : "cursor-pointer"
                      } flex h-full w-full items-center justify-center gap-2 rounded-2xl rounded-r-none border-0 border-r-2 p-2`}
                      onClick={() => {
                        if (!showInviteLink) {
                          navigator.clipboard.writeText(
                            baseUrl + router.asPath
                          );
                          toast.success("Copied to clipboard!");
                        }
                      }}
                    >
                      {showInviteLink ? (
                        <>{router.query.id}</>
                      ) : (
                        <>
                          Copy Invitation Link{" "}
                          <PaperClipIcon className="h-5 w-5" />
                        </>
                      )}
                    </div>
                    <div
                      className="flex items-center justify-center rounded-2xl rounded-l-none p-2"
                      onClick={() => setShowInviteLink(!showInviteLink)}
                    >
                      {showInviteLink ? (
                        <EyeSlashIcon className="h-6 w-6" />
                      ) : (
                        <EyeIcon className="h-6 w-6" />
                      )}
                    </div>
                  </div>
                </div>
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
                    <div
                      key={`team_${i}`}
                      className={`flex h-full w-full flex-col justify-between rounded-md border p-4`}
                      style={{ borderColor: colors[i] }}
                    >
                      <div className="flex items-center gap-2">
                        {isEditTeamName === i ? (
                          <input
                            value={teamName}
                            className="bg-transparent focus:outline-none"
                            autoFocus
                            onChange={(e) => setTeamName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                setIsEditTeamName(-1);
                                editTeamName(i.toString());
                                setTeamName("");
                              }
                            }}
                          />
                        ) : (
                          <div>{team.name}</div>
                        )}
                        {isQuizMaster && isEditTeamName !== i && (
                          <PencilSquareIcon
                            className="h-5 w-5 cursor-pointer"
                            onClick={() => {
                              setIsEditTeamName(i);
                              setTeamName(team.name);
                            }}
                          />
                        )}
                        {isQuizMaster && isEditTeamName === i && (
                          <CheckIcon
                            className="h-5 w-5 cursor-pointer"
                            onClick={() => {
                              setIsEditTeamName(-1);
                              editTeamName(i.toString());
                              setTeamName("");
                            }}
                          />
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {team.players.map((player) => (
                          <PlayerBadge
                            name={player.name}
                            id={player.id}
                            isQuizMaster={isQuizMaster}
                            key={`${player.name}_${player.id}`}
                          />
                        ))}
                      </div>
                      {i.toString() !== user.team && !isQuizMaster && (
                        <Button
                          intent="secondary"
                          className="hover:bg-zinc-800"
                          onClick={() => joinTeam(i.toString())}
                        >
                          Join Team
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      ) : (
        <div className="mx-auto flex h-screen w-1/4 flex-col justify-center gap-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto flex h-screen w-full flex-col justify-center gap-4"
          >
            <Label text="Username" />
            <input
              placeholder="Enter Username"
              maxLength={30}
              {...register("userName", { required: true })}
              className="w-full rounded-md border border-transparent bg-zinc-700 p-3 text-base font-medium text-zinc-200 focus:outline-none"
              autoFocus
            />
            {errors.userName && (
              <div className="text-red-400">Username is required</div>
            )}
            <Button type="submit">Join Lobby</Button>
          </form>
        </div>
      )}
    </>
  );
};

export default Lobby;
