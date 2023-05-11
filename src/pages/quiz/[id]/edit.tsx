import MainContainer from "@components/editQuiz/MainContainer";
import SideBar from "@components/editQuiz/SideBar";
import {
  ArrowPathRoundedSquareIcon,
  Bars3Icon,
  Cog8ToothIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Background from "@ui/Background";
import Button from "@ui/Button";
import { LoadingSpinner } from "@ui/Loader";
import { trpc } from "@utils/trpc";
import { useQuizStore } from "@utils/zustand/quizStore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import SelectionModal from "@components/editQuiz/SelectionModal";
import QuestionList from "@components/editQuiz/QuestionList";
import NavBar from "@components/editQuiz/NavBar";

function Edit() {
  const router = useRouter();
  const quizId = router.query.id as string;
  const [openSelectionModal, setOpenSelectionModal] = useState(false);
  const [openQuestionList, setOpenQuestionList] = useState(false);

  const quiz = trpc.quiz.getQuiz.useQuery(
    { id: quizId },
    { enabled: !!quizId }
  );

  const quizName = useQuizStore((state) => state.name);
  const setQuizName = useQuizStore((state) => state.setName);
  const setCurrentQuestion = useQuizStore((state) => state.setCurrentQuestion);
  const questions = useQuizStore((state) => state.questions);
  const setQuestions = useQuizStore((state) => state.setQuestions);
  const currentQuestion = useQuizStore((state) => state.currentQuestion);

  useEffect(() => {
    if (quizId) {
      quiz.refetch();
    }
  }, []);

  useEffect(() => {
    if (quiz.data) {
      setQuizName(quiz.data.title);
      setQuestions(quiz.data.questions);
      if (quiz.data.questions.length === 0) {
        setCurrentQuestion(-1);
      } else {
        setCurrentQuestion(0);
      }
    }
  }, [quiz.data]);

  useEffect(() => {
    if (currentQuestion >= -1) {
      setOpenQuestionList(false);
    }
  }, [currentQuestion]);

  if (quiz.isLoading || quiz.isFetching) {
    return (
      <div className="flex h-[calc(100vh-57px)] w-full items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!quiz.data && !quiz.isLoading) {
    return <div>Quiz not found</div>;
  }

  return (
    <>
      <NavBar />
      <div className="flex h-screen w-full gap-6 px-4 pb-20 pt-20 text-white lg:pb-4">
        <Background className="relative hidden h-full w-2/5 overflow-hidden lg:block xl:w-1/5">
          <div className="flex h-full w-full flex-col items-center justify-between">
            <div className="flex w-full items-center">
              <p className="w-full truncate text-center text-xl font-semibold">
                {quizName}
              </p>

              <Cog8ToothIcon
                className=" h-6 w-6 cursor-pointer"
                onClick={() => setCurrentQuestion(-1)}
              />
            </div>
            <SideBar />
          </div>
        </Background>
        <Background className="flex h-full w-full justify-center">
          <ScrollArea.Root
            type="auto"
            className="h-full w-full overflow-hidden p-2"
          >
            <ScrollArea.Viewport className="h-full w-full">
              <MainContainer />
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar
              orientation="vertical"
              className="my-2 flex rounded-md bg-zinc-600 p-1"
            >
              <ScrollArea.Thumb className="relative flex rounded-2xl border-4 border-zinc-900" />
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>
        </Background>
      </div>
      <div className="fixed bottom-0 right-0 flex h-16 w-full items-center justify-between bg-zinc-800 px-2 text-white lg:hidden">
        <Cog8ToothIcon
          className=" h-6 w-6 cursor-pointer"
          onClick={() => setCurrentQuestion(-1)}
        />
        <Button
          intent="secondary"
          size="small"
          onClick={() => {
            setOpenSelectionModal(true);
            setOpenQuestionList(false);
          }}
        >
          Add Round
        </Button>
        <SelectionModal
          open={openSelectionModal}
          setOpen={setOpenSelectionModal}
        />
        {openQuestionList ? (
          <XMarkIcon
            className="block h-6 w-6 cursor-pointer"
            aria-hidden="true"
            onClick={() => setOpenQuestionList(false)}
          />
        ) : (
          <Bars3Icon
            className="h-6 w-6 cursor-pointer"
            onClick={() => setOpenQuestionList(true)}
          />
        )}
      </div>
      <div
        className={`${
          openQuestionList ? "flex" : "hidden"
        } fixed left-0 top-0 z-50 h-[calc(100vh-64px)] w-full flex-col bg-black text-white lg:hidden`}
      >
        <div className="flex w-full items-center justify-center gap-2 py-2">
          <ArrowPathRoundedSquareIcon className="h-6 w-6" />
          <p>{`${questions.length} Questions`}</p>
        </div>
        <QuestionList isShowing={openQuestionList} />
      </div>
    </>
  );
}

export default Edit;
