import NavBar from "@components/NavBar";
import Button from "@ui/Button";
import Input from "@ui/Input";
import Label from "@ui/Label";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import CreateLobbyModal from "@components/playQuiz/CreateLobbyModal";
import { SubmitHandler, useForm } from "react-hook-form";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import { GetServerSideProps } from "next";
import Link from "next/link";

const Home: NextPage = () => {
  const { data: session } = useSession();
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
      <div className="h-screen">
        <NavBar />
        <main className="mx-auto flex h-full w-full flex-col items-center justify-start p-4 pt-[20%] sm:w-5/6 md:p-0 md:pt-[10%] lg:pt-[8%] xl:w-3/5 xl:pt-[6%]">
          <div className="flex flex-col items-center gap-10">
            <p className="bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-center text-5xl font-semibold leading-snug text-transparent">
              Quizzer
            </p>
            <p className="text-center text-3xl font-semibold text-gray-300">
              The free multiplayer quiz game where you can be your own quiz
              master and challenge your friends!
            </p>
            <div className="w-full xl:w-3/5">
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
            <div className="w-full xl:w-3/5">
              {session ? (
                <>
                  <Label text="Or create your own lobby" />
                  <div className="group relative mt-2 cursor-pointer">
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
                  <div className="group relative mt-2 cursor-pointer">
                    <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-700 opacity-60 blur transition duration-1000 group-hover:opacity-90 group-hover:duration-200"></div>
                    <Link
                      className="relative flex w-full items-center justify-center rounded-lg bg-zinc-900 px-7 py-4 leading-none text-white"
                      href="/signup"
                    >
                      Sign up
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      session: await getServerSession(context.req, context.res, authOptions),
    },
  };
};

export default Home;
