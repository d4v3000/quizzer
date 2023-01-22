import Main from "@components/editQuiz/Main";
import SideBar from "@components/editQuiz/SideBar";
import { Cog8ToothIcon } from "@heroicons/react/24/outline";
import { ArrowLongLeftIcon } from "@heroicons/react/24/solid";
import Background from "@ui/Background";
import Button from "@ui/Button";
import { trpc } from "@utils/trpc";
import { useQuizStore } from "@utils/zustand/quizStore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function Edit() {
  const router = useRouter();

  const quiz = trpc.quiz.getQuiz.useQuery({ id: router.query.id as string });

  const quizName = useQuizStore((state) => state.name);
  const setQuizName = useQuizStore((state) => state.setName);
  const setNumTeams = useQuizStore((state) => state.setNumTeams);
  const setCurrentQuestion = useQuizStore((state) => state.setCurrentQuestion);
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);

  const handleSettingsClicked = () => {
    setIsSettingsOpen(true);
    setCurrentQuestion(-1);
  };

  useEffect(() => {
    if (quiz.data) {
      setQuizName(quiz.data.title);
      setNumTeams(quiz.data.numberTeams);
    }
  }, [quiz.data]);

  if (quiz.isLoading) {
    return <div>Loading...</div>;
  }

  if (!quiz.data && !quiz.isLoading) {
    return <div>Quiz not found</div>;
  }

  return (
    <div className="flex h-screen flex-col px-10 py-4 text-gray-200">
      <div className="flex w-full justify-between">
        <Button
          intent="secondary"
          size="large"
          onClick={() => router.push("/quiz")}
        >
          <ArrowLongLeftIcon className="h-6 w-6" />
          Back
        </Button>
        <div className="flex gap-6">
          <Button intent="secondary" size="large">
            Save
          </Button>

          <Button intent="secondary" size="large">
            Preview
          </Button>

          <Button intent="primary" size="large">
            Start Quiz
          </Button>
        </div>
      </div>
      <div className="flex h-5/6 w-full flex-grow gap-6 pt-4">
        <Background className="relative flex h-full w-1/5 justify-center">
          <div className="flex h-full w-full flex-col items-center justify-between">
            <p className="text-xl font-semibold">{quizName}</p>
            <Cog8ToothIcon
              className="absolute top-3 right-2 h-6 w-6 cursor-pointer"
              onClick={handleSettingsClicked}
            />
            <SideBar />
          </div>
        </Background>
        <Background className="flex w-full justify-center">
          <Main isSettingsOpen={isSettingsOpen} />
        </Background>
      </div>
    </div>
  );
}

export default Edit;
