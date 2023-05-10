import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { LoadingSpinner } from "@ui/Loader";
import { trpc } from "@utils/trpc";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, ReactNode, useEffect, useState } from "react";

interface IProps {
  children: ReactNode;
}

const NavItem: FC<IProps> = ({ children }) => {
  return (
    <li className="w-full cursor-pointer text-center text-5xl font-bold text-white hover:text-zinc-400 md:w-fit md:text-base md:font-normal">
      {children}
    </li>
  );
};

function NavBar() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const createQuiz = trpc.quiz.createQuiz.useMutation({
    onSuccess(data) {
      router.push(`/quiz/${data.id}/edit`);
    },
  });
  const router = useRouter();

  useEffect(() => {
    if (router.route) {
      setOpen(false);
    }
  }, [router]);

  return (
    <>
      <nav className="fixed top-0 h-[8%] w-full bg-zinc-900">
        <div className="mx-auto flex h-full w-full justify-between p-2 font-semibold text-white sm:w-5/6 md:p-0 xl:w-3/5">
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
          <ul className="hidden flex-1 list-none items-center justify-end space-x-6 py-4 md:flex">
            {!session && (
              <>
                <NavItem>
                  <Link href="/login">Log in</Link>
                </NavItem>
                <li className="cursor-pointer rounded-full bg-gradient-to-r from-indigo-600 to-violet-700 px-4 py-1 text-base text-white hover:text-zinc-500">
                  <Link href="/signup">Sign up</Link>
                </li>
              </>
            )}
            {session && (
              <>
                <NavItem>
                  <Link href="/quiz">Your Quizzes</Link>
                </NavItem>
                <NavItem>
                  <button onClick={() => createQuiz.mutate()}>
                    {createQuiz.status === "loading" ? (
                      <LoadingSpinner />
                    ) : (
                      "Create Quiz"
                    )}
                  </button>
                </NavItem>
                <li className="cursor-pointer rounded-full bg-gradient-to-r from-indigo-600 to-violet-700 px-4 py-1 text-base text-white hover:text-zinc-500">
                  <button onClick={() => signOut({ callbackUrl: "/" })}>
                    Sign out
                  </button>
                </li>
              </>
            )}
          </ul>
          <div className="flex flex-1 items-center justify-end md:hidden">
            {open ? (
              <XMarkIcon
                className="block h-6 w-6 cursor-pointer"
                aria-hidden="true"
                onClick={() => setOpen(false)}
              />
            ) : (
              <Bars3Icon
                className="block h-6 w-6 cursor-pointer"
                aria-hidden="true"
                onClick={() => setOpen(true)}
              />
            )}
          </div>
        </div>
        <hr className="border-zinc-700" />
      </nav>
      <div
        className={`${
          open ? "flex" : "hidden"
        } fixed bottom-0 left-0 z-50 min-h-[92%] w-full overflow-hidden bg-black`}
      >
        <ul className="w-full flex-1 list-none flex-col space-y-12 py-8">
          <NavItem>
            <Link href="/">Home</Link>
          </NavItem>
          {session ? (
            <>
              <NavItem>
                <Link href="/quiz">Your Quizzes</Link>
              </NavItem>
              <NavItem>
                <button onClick={() => createQuiz.mutate()}>
                  {createQuiz.status === "loading" ? (
                    <LoadingSpinner />
                  ) : (
                    "Create Quiz"
                  )}
                </button>
              </NavItem>
              <NavItem>
                <button onClick={() => signOut({ callbackUrl: "/" })}>
                  Sign out
                </button>
              </NavItem>
            </>
          ) : (
            <>
              <NavItem>
                <Link href="/login">Log in</Link>
              </NavItem>
              <NavItem>
                <Link href="/signup">Sign up</Link>
              </NavItem>
            </>
          )}
        </ul>
      </div>
    </>
  );
}

export default NavBar;
