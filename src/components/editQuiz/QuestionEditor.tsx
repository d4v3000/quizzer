import Input from "@ui/Input";
import { useQuizStore } from "@utils/zustand/quizStore";
import { IQuestionAnswer } from "../../models/question";

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
        {(questions[currentQuestion] as IQuestionAnswer).answers.map(
          (answer, i) => (
            <div className="flex items-center gap-2">
              <input
                type="radio"
                checked={answer.correct}
                onClick={() => {
                  const newQuestions = [...questions];
                  (
                    questions[currentQuestion] as IQuestionAnswer
                  ).answers.forEach((answer) => (answer.correct = false));
                  (questions[currentQuestion] as IQuestionAnswer).answers[
                    i
                  ]!.correct = true;
                  useQuizStore.setState({ questions: newQuestions });
                }}
              />
              <Input
                placeholder={answer.id}
                value={answer.title}
                onChange={(e) => {
                  const newQuestions = [...questions];
                  (questions[currentQuestion] as IQuestionAnswer).answers[
                    i
                  ]!.title = e.target.value;
                  useQuizStore.setState({ questions: newQuestions });
                }}
              />
            </div>
          )
        )}
      </div>
      <div className="mt-2 flex justify-center gap-2">
        <input type="radio" checked={true} />
        <p>{" = Correct Answer"}</p>
      </div>
    </>
  );
};

export default QuestionEditor;
