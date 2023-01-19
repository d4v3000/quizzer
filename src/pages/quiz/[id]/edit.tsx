import Main from "@components/editQuiz/Main";
import { Cog8ToothIcon } from "@heroicons/react/24/outline";
import { ArrowLongLeftIcon } from "@heroicons/react/24/solid";
import Background from "@ui/Background";
import Button from "@ui/Button";
import { trpc } from "@utils/trpc";
import { useRouter } from "next/router";
import { useState } from "react";

function Edit() {
  const router = useRouter();

  const quiz = trpc.quiz.getQuiz.useQuery({ id: router.query.id as string });

  const [quizName, setQuizName] = useState(quiz.data?.title);

  if (quiz.isLoading) {
    return <div>Loading...</div>;
  }

  if (!quiz.data && !quiz.isLoading) {
    return <div>Quiz not found</div>;
  }

  return (
    <div className="flex h-[calc(100vh-57px)] flex-col bg-zinc-900 text-gray-200">
      <div className="flex h-full flex-col px-10 py-4">
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
        <div className="flex h-full w-full flex-grow gap-6 pt-4">
          <Background className="relative flex w-1/6 flex-col items-center">
            <p>{quizName}</p>
            <Cog8ToothIcon className="absolute top-2 right-2 h-6 w-6" />
            <p>Sidebar</p>
          </Background>
          <Background className="flex w-full justify-center">
            <Main setQuizName={setQuizName} quizName={quizName} />
          </Background>
        </div>
      </div>
    </div>
  );
}

export default Edit;
