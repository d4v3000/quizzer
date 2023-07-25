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
  const [wasKicked, setWasKicked] = useState(false);

  const userName = useGameStore((state) => state.userName);
  const user = useGameStore((state) => state.user);
  const setUser = useGameStore((state) => state.setUser);
  const socketId = useGameStore((state) => state.socketId);
  const quizName = useGameStore((state) => state.quizName);
  const numOfQuestions = useGameStore((state) => state.numOfQuestions);
  const numOfTeams = useGameStore((state) => state.numOfTeams);
  const messages = useGameStore((state) => state.messages);
  const addMessage = useGameStore((state) => state.addMessage);
  const isQuizMaster = !!(userName && socketId);

  const colors = ["#991b1b", "#1e40af", "#166534", "#6b21a8", "#854d0e"];

  useEffect(() => {
    if (userName && socketId && quizName && numOfQuestions) {
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
      addMessage(message);
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
      setUser({ team: null, name: user.name, id: user.id });
      setLobby(data);
    };

    const onTeamsRandomized = (data: ILobby) => {
      if (!isQuizMaster) {
        const playerIndex = data.players.findIndex(
          (player) => player.id === socket.id
        );

        setUser({
          team: data.players[playerIndex]!.team,
          name: user.name,
          id: user.id,
        });
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
      {wasKicked ? (
        <div className="mx-auto flex h-screen w-1/4 flex-col justify-center gap-4">
          You were kicked by the quiz master
        </div>
      ) : (
        <div className="mx-auto flex h-full w-10/12 flex-col gap-2 py-4">
          <NavBar
            isQuizMaster={isQuizMaster}
            players={lobby?.players}
            userName={user.name}
          />
          <div className="flex h-full w-full grid-rows-3 flex-col gap-4 overflow-clip md:grid md:grid-flow-col md:grid-cols-4 xl:grid-cols-6">
            <Background className="h-80 md:col-span-2 md:row-span-2 md:h-full xl:col-start-3">
              <InformationCard
                isQuizMaster={isQuizMaster}
                numOfQuestions={lobby?.numOfQuestions}
                quizMaster={lobby?.quizMaster}
                quizName={lobby?.quizName}
              />
            </Background>
            <Background className="h-96 md:col-span-2 md:col-start-3 md:row-span-2 md:h-full xl:col-start-5">
              <ChatCard />
            </Background>
            <div className="col-start-1 h-full md:col-end-5 xl:col-end-7">
              <div className="flex h-full flex-col gap-4 md:flex-row">
                {lobby?.teams.map((team, i) => (
                  <TeamCard
                    key={`team_${i}`}
                    color={colors[i]!}
                    index={i.toString()}
                    isQuizMaster={isQuizMaster}
                    name={team.name}
                    players={team.players}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Lobby;
