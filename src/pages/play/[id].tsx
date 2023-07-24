import { ReactNode, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { LoadingSpinner } from "@ui/Loader";
import Lobby from "@components/playQuiz/Lobby";
import Game from "@components/playQuiz/Game";
import { IGame } from "../../models/game";
import { useGameStore } from "@utils/zustand/gameStore";
import { socket } from "@utils/websocket/socket";

const PageWrapper = (props: { children: ReactNode }) => {
  return (
    <div className="mx-auto flex items-center justify-center text-white md:h-screen">
      {props.children}
    </div>
  );
};

function Play() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [doesLobbyExist, setDoesLobbyExist] = useState(false);
  const { gameStarted, setGameStarted } = useGameStore();

  useEffect(() => {
    const onGameStarted = () => {
      setGameStarted(true);
    };

    socket.on("game-started", onGameStarted);

    return () => {
      socket.off("game-started", onGameStarted);
    };
  }, []);

  useEffect(() => {
    const URL = process.env.NEXT_PUBLIC_NODE_URL || "http://localhost:4000";
    // check if lobby exists
    if (router.query.id) {
      axios
        .get<IGame>(`${URL}/lobby/${router.query.id}`)
        .then((res) => {
          setGameStarted(res.data.gameStarted);
          setIsLoading(false);
          setDoesLobbyExist(true);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [router.query]);

  if (isLoading) {
    return (
      <PageWrapper>
        <LoadingSpinner />
      </PageWrapper>
    );
  }

  if (!doesLobbyExist) {
    return (
      <PageWrapper>
        <p className="text-2xl">Lobby doesn&apos;t exist</p>
      </PageWrapper>
    );
  }

  return (
    <div className="mx-auto flex items-center justify-center text-white md:h-screen">
      {gameStarted ? <Game /> : <Lobby />}
    </div>
  );
}

export default Play;
