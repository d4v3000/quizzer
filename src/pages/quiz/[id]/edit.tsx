import MainContainer from "@components/editQuiz/MainContainer";
import SideBar from "@components/editQuiz/SideBar";
import CreateLobbyModal from "@components/playQuiz/CreateLobbyModal";
import { Cog8ToothIcon } from "@heroicons/react/24/outline";
import { ArrowLongLeftIcon } from "@heroicons/react/24/solid";
import Background from "@ui/Background";
import Button from "@ui/Button";
import { LoadingSpinner } from "@ui/Loader";
import { trpc } from "@utils/trpc";
import { useQuizStore } from "@utils/zustand/quizStore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function Edit() {
  const router = useRouter();

  const quiz = trpc.quiz.getQuiz.useQuery({ id: router.query.id as string });
  const editQuiz = trpc.quiz.editQuiz.useMutation();

  const quizName = useQuizStore((state) => state.name);
  const numTeams = useQuizStore((state) => state.numTeams);
  const setQuizName = useQuizStore((state) => state.setName);
  const setNumTeams = useQuizStore((state) => state.setNumTeams);
  const setCurrentQuestion = useQuizStore((state) => state.setCurrentQuestion);
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);
  const questions = useQuizStore((state) => state.questions);
  const setQuestions = useQuizStore((state) => state.setQuestions);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSettingsClicked = () => {
    setIsSettingsOpen(true);
    setCurrentQuestion(-1);
  };

  const handleSave = () => {
    editQuiz.mutate({
      id: router.query.id as string,
      title: quizName,
      numberTeams: numTeams,
      questions: questions,
    });
  };

  useEffect(() => {
    quiz.refetch();
    if (questions.length > 0) {
      setCurrentQuestion(0);
    }
  }, []);

  useEffect(() => {
    if (quiz.data) {
      setQuizName(quiz.data.title);
      setNumTeams(quiz.data.numberTeams);
      setQuestions(quiz.data.questions);
    }
  }, [quiz.data]);

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
    <div className="flex h-screen flex-col px-10 py-4 text-gray-200">
      <div className="flex w-full justify-between">
        <Button intent="secondary" size="large" onClick={() => router.back()}>
          <ArrowLongLeftIcon className="h-6 w-6" />
          Back
        </Button>
        <div className="flex gap-6">
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
        quizId={router.query.id as string}
        numOfQuestions={questions.length.toString()}
        quizTitle={quizName}
      />
      <div className="flex h-full w-full gap-6 pt-4">
        <Background className="relative h-full w-1/5 overflow-hidden ">
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
        <Background className="flex w-full justify-center">
          <MainContainer isSettingsOpen={isSettingsOpen} />
        </Background>
      </div>
    </div>
  );
}

export default Edit;
