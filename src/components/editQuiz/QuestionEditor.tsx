import Input from "@ui/Input";
import { useQuizStore } from "@utils/zustand/quizStore";

const QuestionEditor = () => {
  const questions = useQuizStore((state) => state.questions);
  const currentQuestion = useQuizStore((state) => state.currentQuestion);

  return (
    <>
      <div className="flex w-full items-center gap-2 py-2">
        <p className="min-w-fit pr-2 text-sm font-semibold uppercase italic text-zinc-400">
          Answers
        </p>
        <hr className="border-1 w-full border-zinc-400" />
      </div>
      <div className="grid grid-cols-2 grid-rows-2 gap-4">
        {questions[currentQuestion]!.answers.map((answer, i) => (
          <div className="flex items-center gap-2">
            <input
              type="radio"
              checked={answer.isCorrect}
              className="cursor-pointer accent-violet-700"
              onClick={() => {
                const newQuestions = [...questions];

                questions[currentQuestion]!.answers.forEach(
                  (answer) => (answer.isCorrect = false)
                );
                questions[currentQuestion]!.answers[i]!.isCorrect = true;
                useQuizStore.setState({ questions: newQuestions });
              }}
            />
            <Input
              placeholder={answer.placeholder}
              value={answer.title}
              onChange={(e) => {
                const newQuestions = [...questions];
                questions[currentQuestion]!.answers[i]!.title = e.target.value;
                useQuizStore.setState({ questions: newQuestions });
              }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-center gap-2">
        <input
          type="radio"
          className="accent-violet-700"
          checked={true}
          readOnly={true}
        />
        <p>{" = Correct Answer"}</p>
      </div>
    </>
  );
};

export default QuestionEditor;
