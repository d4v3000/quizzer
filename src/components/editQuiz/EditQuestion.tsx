import Input from "@ui/Input";
import { useQuizStore } from "@utils/zustand/quizStore";
import { isUndefined } from "lodash";

const EditQuestion = () => {
  const questions = useQuizStore((state) => state.questions);
  const currentQuestion = useQuizStore((state) => state.currentQuestion);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuestions = [...questions];
    newQuestions[currentQuestion]!.title = e.target.value;
    useQuizStore.setState({ questions: newQuestions });
  };

  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full items-center gap-2 py-2">
        <p className="min-w-fit pr-2 text-sm font-semibold uppercase italic text-zinc-400">
          Question
        </p>
        <hr className="border-1 w-full border-zinc-400" />
      </div>
      <Input
        placeholder="Name of the quiz"
        onChange={(e) => handleNameChange(e)}
        value={questions[currentQuestion]?.title}
      />
    </div>
  );
};

export default EditQuestion;
