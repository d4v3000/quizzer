import Input from "@ui/Input";
import { useQuizStore } from "@utils/zustand/quizStore";
import { IGuessingAnswer } from "../../models/question";

const GuessingEditor = () => {
  const questions = useQuizStore((state) => state.questions);
  const currentQuestion = useQuizStore((state) => state.currentQuestion);

  return (
    <>
      <div className="flex w-full items-center gap-2 py-2">
        <p className="min-w-fit pr-2 text-sm font-semibold uppercase italic text-zinc-400">
          Answer
        </p>
        <hr className="border-1 w-full border-zinc-400" />
      </div>
      <Input
        placeholder="Enter the correct number"
        type={"number"}
        value={(questions[currentQuestion] as IGuessingAnswer).answer}
        onChange={(e) => {
          const newQuestions = [...questions];
          (questions[currentQuestion] as IGuessingAnswer).answer =
            e.target.value;
          useQuizStore.setState({ questions: newQuestions });
        }}
      />
    </>
  );
};

export default GuessingEditor;
