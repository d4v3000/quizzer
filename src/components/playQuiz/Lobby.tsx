import Background from "@ui/Background";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useGameStore } from "@utils/zustand/gameStore";
import { socket } from "@utils/websocket/socket";
import TeamCard from "./TeamCard";
import NavBar from "./NavBar";
import JoinForm from "./JoinForm";
import InformationCard from "./InformationCard";
import ChatCard from "./ChatCard";

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
  const [wasKicked, setWasKicked] = useState(false);

  const userName = useGameStore((state) => state.userName);
  const socketId = useGameStore((state) => state.socketId);
  const quizName = useGameStore((state) => state.quizName);
  const numOfQuestions = useGameStore((state) => state.numOfQuestions);
  const numOfTeams = useGameStore((state) => state.numOfTeams);
  const messages = useGameStore((state) => state.messages);
  const setMessages = useGameStore((state) => state.setMessages);
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
  }, []);

  useEffect(() => {
    const onLobbyJoin = (data: ILobby, message: IMessage) => {
      setLobby(data);
      setMessages([...messages, message]);
    };

    const onTeamJoin = (data: ILobby) => {
      setLobby(data);
    };

    const onTeamNameEdited = (data: ILobby) => {
      setLobby(data);
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
    socket.on("team-name-edited", onTeamNameEdited);
    socket.on("player-disconnect", onPlayerDisconnect);
    socket.on("teams-reset", onTeamsReset);
    socket.on("teams-randomized", onTeamsRandomized);

    return () => {
      socket.off("joined-lobby", onLobbyJoin);
      socket.off("joined-team", onTeamJoin);
      socket.off("team-name-edited", onTeamNameEdited);
      socket.off("player-disconnect", onPlayerDisconnect);
      socket.off("teams-reset", onTeamsReset);
      socket.off("teams-randomized", onTeamsRandomized);
    };
  }, [messages]);

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
                <ChatCard user={user} />
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
