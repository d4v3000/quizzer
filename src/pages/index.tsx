import NavBar from "@components/NavBar";
import Button from "@ui/Button";
import Input from "@ui/Input";
import Label from "@ui/Label";
import { LoadingSpinner } from "@ui/Loader";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import CreateLobbyModal from "@components/playQuiz/CreateLobbyModal";
import { SubmitHandler, useForm } from "react-hook-form";

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ inviteCode: string }>();
  const onSubmit: SubmitHandler<{ inviteCode: string }> = (data) =>
    router.push(`/play/${data.inviteCode}`);

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

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex gap-2 pt-2"
              >
                <Input
                  {...register("inviteCode", { required: true })}
                  placeholder="Invitation Code"
                  className="py-4"
                />
                <Button
                  intent="secondary"
                  className="w-1/4 hover:scale-[1.03]"
                  type="submit"
                >
                  Join Lobby
                </Button>
              </form>

              {errors.inviteCode && (
                <div className="text-red-400">Invitation code is required</div>
              )}
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
                  <CreateLobbyModal
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                  />
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
      </main>
    </>
  );
};

export default Home;
