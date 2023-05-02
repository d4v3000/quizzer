import Button from "@ui/Button";
import { LoadingSpinner } from "@ui/Loader";
import { trpc } from "@utils/trpc";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

function NavBar() {
  const { data: session, status } = useSession();
  const createQuiz = trpc.quiz.createQuiz.useMutation();
  const router = useRouter();

  if (createQuiz.data) {
    router.push(`/quiz/${createQuiz.data.id}/edit`);
  }

  return (
    <nav className="sticky top-0 w-full bg-zinc-900">
      <div className="mx-auto flex w-3/5 justify-between font-semibold text-zinc-400">
        <div
          className="flex cursor-pointer items-center"
          onClick={() => router.push("/")}
        >
          <div className="relative h-full w-10">
            <Image
              src="/quizzerLogo.svg"
              alt="Quizzer Logo"
              className="p-2"
              fill
            />
          </div>
          <p className="text-3xl text-white">Quizzer</p>
        </div>
        <div className="flex gap-4">
          {status === "loading" ? (
            <div className="flex animate-pulse gap-3">
              <div className="my-3 ml-4 w-16 rounded-md bg-zinc-600 px-3 py-3.5"></div>
              <div className="my-3 w-16 rounded-md bg-zinc-600 px-3 py-1.5"></div>
              <div className="my-3 mr-4 w-16 rounded-md bg-zinc-600 px-3 py-1.5"></div>
            </div>
          ) : (
            <>
              {!session && (
                <>
                  <Link href="/login">
                    <span className="my-3 ml-4 flex items-center p-1 text-indigo-400 hover:text-white">
                      Log in
                    </span>
                  </Link>
                  <Link href="/signup">
                    <span className="my-3 mr-4 flex items-center rounded-md bg-gradient-to-r from-indigo-600 to-violet-700 px-3 py-1.5 text-sm text-white">
                      Sign up
                    </span>
                  </Link>
                </>
              )}
              {session && (
                <>
                  <Link href="/quiz">
                    <span className="my-3 ml-4 flex items-center p-1 text-indigo-400 hover:text-white">
                      Your Quizzes
                    </span>
                  </Link>
                  <button
                    onClick={() => createQuiz.mutate()}
                    disabled={createQuiz.status === "loading"}
                  >
                    {createQuiz.status === "loading" ? (
                      <LoadingSpinner />
                    ) : (
                      "Create Quiz"
                    )}
                  </button>
                  <Button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    intent="primary"
                    size="small"
                  >
                    Sign out
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </div>
      <hr className="border-zinc-700" />
    </nav>
  );
}

export default NavBar;
