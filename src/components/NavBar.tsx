import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { trpc } from "../utils/trpc";
import { Button } from "./ui/Button";

function NavBar() {
  const { data: session } = useSession();
  const createQuiz = trpc.quiz.createQuiz.useMutation();

  return (
    <nav className="sticky top-0 w-full bg-black">
      <div className="mx-auto flex w-3/5 justify-between font-semibold text-zinc-400">
        <p className="flex items-center p-3">Logo</p>

        {!session && (
          <div className="flex gap-4">
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
          </div>
        )}
        {session && (
          <div className="flex gap-4">
            <Link href="/quiz">
              <span className="my-3 ml-4 flex items-center p-1 text-indigo-400 hover:text-white">
                Quiz
              </span>
            </Link>
            <button onClick={() => createQuiz.mutate()}>Create Quiz</button>
            <Button onClick={() => signOut()} intent="primary" size="small">
              Sign out
            </Button>
          </div>
        )}
      </div>
      <hr className="border-zinc-800" />
    </nav>
  );
}

export default NavBar;
