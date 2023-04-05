import NavBar from "@components/NavBar";
import Button from "@ui/Button";
import Input from "@ui/Input";
import Label from "@ui/Label";
import { LoadingSpinner } from "@ui/Loader";
import Modal from "@ui/Modal";
import Select from "@ui/Select";
import { toNumber } from "lodash";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [numOfTeams, setNumOfTeams] = useState(2);

  return (
    <>
      <NavBar />
      <main className="mx-auto flex h-[calc(100vh-57px)] w-3/5 flex-col items-center justify-start pt-10">
        {status === "loading" ? (
          <LoadingSpinner />
        ) : (
          <div className="flex flex-col items-center gap-10">
            <p className="bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-center text-5xl font-semibold leading-snug text-transparent">
              Quizzer
            </p>
            <p className="text-center text-3xl font-semibold text-gray-300">
              The free multiplayer quiz game where you can be your own quiz
              master and challenge your friends!
            </p>
            <div className="w-3/5">
              <Label text="Enter invitation code" />
              <div className="flex gap-2 pt-2">
                <Input placeholder="Invitation Code" className="py-4" />
                <Button
                  intent="secondary"
                  className="w-1/4 hover:scale-[1.03]"
                  onClick={() => setIsModalOpen(true)}
                >
                  Join Lobby
                </Button>
              </div>
            </div>
            <div className="w-3/5">
              {session ? (
                <>
                  <Label text="Or create your own lobby" />
                  <div className="group relative mt-2">
                    <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-700 opacity-60 blur transition duration-1000 group-hover:opacity-90 group-hover:duration-200"></div>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="relative flex w-full items-center justify-center rounded-lg bg-zinc-900 py-4 font-semibold leading-none text-white"
                    >
                      Create Room
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Label text="Or sign up/login to create your own lobby" />
                  <div className="group relative mt-2">
                    <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-700 opacity-60 blur transition duration-1000 group-hover:opacity-90 group-hover:duration-200"></div>
                    <button
                      onClick={() => router.push("/signup")}
                      className="relative flex w-full items-center justify-center rounded-lg bg-zinc-900 px-7 py-4 leading-none text-white"
                    >
                      Sign up
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        <Modal open={isModalOpen} setOpen={setIsModalOpen}>
          <div className="flex w-80 flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label text="Username" />
              <Input
                placeholder="Name of the question"
                intent="secondary"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                maxLength={30}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label text="Number of teams" />
              <select
                className="w-full rounded-md border border-transparent bg-zinc-700 p-3 text-base text-zinc-200 focus:outline-none"
                value={numOfTeams}
                onChange={(e) => setNumOfTeams(toNumber(e.target.value))}
              >
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </select>
            </div>
            <Button>Create</Button>
          </div>
        </Modal>
      </main>
    </>
  );
};

export default Home;
