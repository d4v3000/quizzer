import {
  EyeIcon,
  EyeSlashIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
} from "@heroicons/react/24/outline";
import Background from "@ui/Background";
import Button from "@ui/Button";
import Input from "@ui/Input";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as Tabs from "@radix-ui/react-tabs";
import { useGameStore } from "@utils/zustand/gameStore";
import { socket } from "@utils/websocket/socket";
import Label from "@ui/Label";
import { SubmitHandler, useForm } from "react-hook-form";

interface IFormInputs {
  userName: string;
}

interface IPlayer {
  id: string;
  name: string;
}

interface ITeam {
  id: string;
  players: IPlayer[];
  name: string;
}

interface ILobby {
  id: string;
  teams: ITeam[];
  playersWithoutTeam: IPlayer[];
  quizMaster: IPlayer;
  quizName: string;
  numOfQuestions: string;
}

const Lobby = () => {
  const baseUrl = "http://localhost:3000" || process.env.BASE_URL;
  const router = useRouter();
  const [showInviteLink, setShowInviteLink] = useState(false);
  const [lobby, setLobby] = useState<ILobby>();
  const [user, setUser] = useState<{ id: string; name: string }>();

  const userName = useGameStore((state) => state.userName);
  const socketId = useGameStore((state) => state.socketId);
  const quizName = useGameStore((state) => state.quizName);
  const numOfQuestions = useGameStore((state) => state.numOfQuestions);
  const numOfTeams = useGameStore((state) => state.numOfTeams);
  const isQuizMaster = userName && socketId;

  const colors = ["#991b1b", "#1e40af", "#166534", "#6b21a8", "#854d0e"];

  const messages = [
    { message: "Player 1 joined the game", sender: "system" },
    { message: "Hey", sender: "Player 1" },
    { message: "Player 1 left the game", sender: "system" },
    { message: "Player 2 joined the game", sender: "system" },
    { message: "What's up?", sender: "Player 2" },
  ];

  const teamMessages = [
    { message: "Player 1 joined your team", sender: "system" },
    { message: "Hey", sender: "Player 1" },
    { message: "Player 2 joined your team", sender: "system" },
    { message: "What's up?", sender: "Player 2" },
  ];

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
    setUser({ id: socket.id, name: data.userName });
  };

  useEffect(() => {
    if (userName && socketId && quizName && numOfQuestions) {
      setUser({ id: socketId, name: userName });

      const lobby = {
        id: router.query.id as string,
        playersWithoutTeam: [] as IPlayer[],
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

    const onLobbyJoin = (data: ILobby) => {
      setLobby(data);
    };

    socket.on("joined-lobby", onLobbyJoin);

    return () => {
      socket.off("joined-lobby", onLobbyJoin);
    };
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputs>();
  const onSubmit: SubmitHandler<IFormInputs> = (data) => joinLobby(data);

  return (
    <>
      {user ? (
        <div className="mx-auto grid h-screen w-10/12 grid-flow-col grid-cols-5 grid-rows-3 gap-4 py-8">
          <Background className="col-span-1 row-span-2">
            <div className="flex flex-col gap-8 p-2">
              <h2 className="text-2xl font-bold">
                Players currently unassigned:
              </h2>
              <div className="flex flex-col gap-2">
                {lobby?.playersWithoutTeam.map((player) => (
                  <p key={player.id}>
                    {player.name} {socket.id === player.id ? "(You)" : ""}
                  </p>
                ))}
              </div>
            </div>
          </Background>
          <div className="col-span-5">
            <div className="flex h-full gap-4">
              {lobby?.teams.map((team, i) => (
                <div
                  key={`team_${i}`}
                  className={`flex h-full w-full flex-col justify-between rounded-md border p-4`}
                  style={{ borderColor: colors[i] }}
                >
                  Team Name
                  <div className="flex flex-wrap gap-2">
                    {team.players.map((player, j) => (
                      <div
                        key={`${player.name}_${player.id}`}
                        className="flex items-center rounded-full border border-zinc-600 py-1 px-3 text-sm"
                      >
                        {player.name} {socket.id === player.id ? "(You)" : ""}
                      </div>
                    ))}
                  </div>
                  <Button intent="secondary" className="hover:bg-zinc-800">
                    Join Team
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <Background className="col-span-3 row-span-2">
            <div className="flex h-full flex-col items-center justify-between p-4">
              <div className="flex w-full flex-col items-center gap-3">
                <h1 className="text-3xl font-extrabold">{lobby?.quizName}</h1>
                <h2 className="text-xl font-bold">
                  presentend to you by: {lobby?.quizMaster.name}
                  {lobby?.quizMaster.id === socket.id ? " (You)" : ""}
                </h2>
                <h3>
                  You can expect {lobby?.numOfQuestions} Questions this evening
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
                      navigator.clipboard.writeText(baseUrl + router.asPath);
                      toast.success("Copied to clipboard!");
                    }
                  }}
                >
                  {showInviteLink ? (
                    <>{router.query.id}</>
                  ) : (
                    <>
                      Copy Invitation Link <PaperClipIcon className="h-5 w-5" />
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
          <Background className="col-span-1 row-span-2">
            <div className="flex h-full flex-col p-2">
              <Tabs.Root className="h-full" defaultValue="tab1">
                <Tabs.List className="flex pb-2">
                  <Tabs.Trigger
                    className="w-full border-b-purple-600 pb-1 data-[state=active]:border-b"
                    value="tab1"
                  >
                    Global
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    className="w-full border-b-purple-600 pb-1 data-[state=active]:border-b"
                    value="tab2"
                  >
                    Team
                  </Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value="tab1">
                  <div className="flex h-full flex-col gap-2">
                    {messages.map((message, i) => (
                      <>
                        {message.sender === "system" ? (
                          <p
                            key={`message_${i}`}
                            className="text-center text-sm text-zinc-400"
                          >
                            {message.message}
                          </p>
                        ) : (
                          <p
                            key={`message_${i}`}
                            className="text-base text-zinc-200"
                          >
                            <span className="font-bold">
                              {message.sender}:{" "}
                            </span>
                            {message.message}
                          </p>
                        )}
                      </>
                    ))}
                  </div>
                </Tabs.Content>
                <Tabs.Content value="tab2">
                  <div className="flex h-full flex-col gap-2">
                    {teamMessages.map((message, i) => (
                      <>
                        {message.sender === "system" ? (
                          <p
                            key={`message_${i}`}
                            className="text-center text-sm text-zinc-400"
                          >
                            {message.message}
                          </p>
                        ) : (
                          <p
                            key={`message_${i}`}
                            className="text-base text-zinc-200"
                          >
                            <span className="font-bold">
                              {message.sender}:{" "}
                            </span>
                            {message.message}
                          </p>
                        )}
                      </>
                    ))}
                  </div>
                </Tabs.Content>
              </Tabs.Root>
              <div className="flex items-center gap-2">
                <Input placeholder="Enter Message..." />
                <button className="flex h-full items-center gap-2 rounded-md border p-2 hover:bg-zinc-800">
                  Send <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </Background>
        </div>
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
