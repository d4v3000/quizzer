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
    const URL = "http://localhost:3000" || process.env.NODE_URL;
    // check if lobby exists
    if (router.query) {
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
    <div className="mx-auto flex h-screen items-center justify-center text-white">
      {isLoading ? (
        <LoadingSpinner />
      ) : doesLobbyExist ? (
        <Lobby />
      ) : (
        <p className="text-2xl">Lobby doesn't exist</p>
      )}
    </div>
  );
}

export default Play;
