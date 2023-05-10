import MainContainer from "@components/editQuiz/MainContainer";
import SideBar from "@components/editQuiz/SideBar";
import CreateLobbyModal from "@components/playQuiz/CreateLobbyModal";
import {
  ArrowPathRoundedSquareIcon,
  Bars3Icon,
  Cog8ToothIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ArrowLongLeftIcon } from "@heroicons/react/24/solid";
import Background from "@ui/Background";
import Button from "@ui/Button";
import { LoadingSpinner } from "@ui/Loader";
import { trpc } from "@utils/trpc";
import { useQuizStore } from "@utils/zustand/quizStore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import SelectionModal from "@components/editQuiz/SelectionModal";
import QuestionList from "@components/editQuiz/QuestionList";

function Edit() {
  const router = useRouter();
  const quizId = router.query.id as string;
  const [openSelectionModal, setOpenSelectionModal] = useState(false);
  const [openQuestionList, setOpenQuestionList] = useState(false);

  const quiz = trpc.quiz.getQuiz.useQuery(
    { id: quizId },
    { enabled: !!quizId }
  );

  const editQuiz = trpc.quiz.editQuiz.useMutation({
    onSuccess: () => toast.success("Quiz saved succesfully"),
    onError: () => toast.error("There was an error saving this quiz"),
  });

  const quizName = useQuizStore((state) => state.name);
  const setQuizName = useQuizStore((state) => state.setName);
  const setCurrentQuestion = useQuizStore((state) => state.setCurrentQuestion);
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);
  const questions = useQuizStore((state) => state.questions);
  const setQuestions = useQuizStore((state) => state.setQuestions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentQuestion = useQuizStore((state) => state.currentQuestion);

  const handleSettingsClicked = () => {
    setIsSettingsOpen(true);
    setCurrentQuestion(-1);
  };

  const handleSave = () => {
    editQuiz.mutate({
      id: quizId,
      title: quizName,
      questions: questions,
    });
  };

  useEffect(() => {
    if (quizId) {
      quiz.refetch();
    }
    if (questions.length > 0) {
      setCurrentQuestion(0);
    }
  }, []);

  useEffect(() => {
    if (quiz.data) {
      setQuizName(quiz.data.title);
      setQuestions(quiz.data.questions);
    }
  }, [quiz.data]);

  useEffect(() => {
    if (currentQuestion >= 0) {
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
    <div className="flex h-screen flex-col gap-3 px-4 py-3 text-gray-200 md:py-4 lg:px-10">
      <div className="flex h-[5%] w-full justify-between gap-2 lg:gap-0">
        <Button intent="secondary" size="large" onClick={() => router.back()}>
          <ArrowLongLeftIcon className="h-6 w-6" />
          Back
        </Button>
        <div className="flex gap-2 lg:gap-6">
          <Button intent="secondary" size="large" onClick={handleSave}>
            {editQuiz.isLoading ? <LoadingSpinner /> : "Save"}
          </Button>

          <Button
            intent="primary"
            size="large"
            onClick={() => setIsModalOpen(true)}
          >
            Start Quiz
          </Button>
        </div>
      </div>
      <CreateLobbyModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        quizId={quizId}
        numOfQuestions={questions.length.toString()}
        quizTitle={quizName}
      />
      <div className="flex h-[85%] w-full gap-6 lg:h-[95%]">
        <Background className="relative hidden h-full w-2/5 overflow-hidden lg:block xl:w-1/5">
          <div className="flex h-full w-full flex-col items-center justify-between">
            <div className="flex w-full items-center">
              <p className="w-full truncate text-center text-xl font-semibold">
                {quizName}
              </p>

              <Cog8ToothIcon
                className=" h-6 w-6 cursor-pointer"
                onClick={handleSettingsClicked}
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
              <MainContainer isSettingsOpen={isSettingsOpen} />
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
      <div className="fixed bottom-0 right-0 flex h-[8%] w-full items-center justify-between bg-zinc-800 px-2 lg:hidden">
        <Cog8ToothIcon
          className=" h-6 w-6 cursor-pointer"
          onClick={handleSettingsClicked}
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
        } absolute bottom-[8%] left-0 z-50 h-[92%] w-full flex-col bg-black`}
      >
        <div className="flex w-full items-center justify-center gap-2 py-2">
          <ArrowPathRoundedSquareIcon className="h-6 w-6" />
          <p>{`${questions.length} Questions`}</p>
        </div>
        <QuestionList isShowing={openQuestionList} />
      </div>
    </div>
  );
}

export default Edit;
