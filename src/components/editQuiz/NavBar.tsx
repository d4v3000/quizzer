import CreateLobbyModal from "@components/playQuiz/CreateLobbyModal";
import { ArrowLongLeftIcon } from "@heroicons/react/24/outline";
import Button from "@ui/Button";
import { LoadingSpinner } from "@ui/Loader";
import { trpc } from "@utils/trpc";
import { useQuizStore } from "@utils/zustand/quizStore";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";

const NavBar = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const quizId = router.query.id as string;
  const quizName = useQuizStore((state) => state.name);
  const questions = useQuizStore((state) => state.questions);

  const editQuiz = trpc.quiz.editQuiz.useMutation({
    onSuccess: () => toast.success("Quiz saved succesfully"),
    onError: () => toast.error("There was an error saving this quiz"),
  });

  const handleSave = () => {
    editQuiz.mutate({
      id: quizId,
      title: quizName,
      questions: questions,
    });
  };
  return (
    <>
      <div className="fixed top-0 h-16 w-full">
        <div className="flex h-full w-full justify-between gap-2 px-3 pt-4 lg:gap-0">
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
      </div>
      <CreateLobbyModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        quizId={quizId}
        numOfQuestions={questions.length.toString()}
        quizTitle={quizName}
      />
    </>
  );
};

export default NavBar;
