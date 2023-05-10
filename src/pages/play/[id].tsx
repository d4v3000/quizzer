import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { LoadingSpinner } from "@ui/Loader";
import Lobby from "@components/playQuiz/Lobby";

function Play() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [doesLobbyExist, setDoesLobbyExist] = useState(false);

  useEffect(() => {
    const URL = process.env.NEXT_PUBLIC_NODE_URL || "http://localhost:4000";
    // check if lobby exists
    if (router.query.id) {
      axios
        .post(`${URL}/lobby`, router.query)
        .then(() => {
          setIsLoading(false);
          setDoesLobbyExist(true);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [router.query]);

  return (
    <div className="mx-auto flex items-center justify-center text-white md:h-screen">
      {isLoading ? (
        <LoadingSpinner />
      ) : doesLobbyExist ? (
        <Lobby />
      ) : (
        <p className="text-2xl">Lobby doesn&apos;t exist</p>
      )}
    </div>
  );
}

export default Play;
