import Input from "@ui/Input";
import Label from "@ui/Label";
import { useQuizStore } from "@utils/zustand/quizStore";

const QuestionEditor = () => {
  const questions = useQuizStore((state) => state.questions);
  const currentQuestion = useQuizStore(
    (state) => state.questions[state.currentQuestion]!.multipleChoiceAnswers!
  );
  const setQuestions = useQuizStore((state) => state.setQuestions);

  return (
    <>
      <Label text="Answers" />
      <div className="grid grid-cols-2 grid-rows-2 gap-4">
        {currentQuestion.answers.map((answer, i) => (
          <div key={`radio_${i}`} className="flex items-center gap-2">
            <input
              type="radio"
              checked={answer.isCorrect}
              className="cursor-pointer accent-violet-700"
              onChange={() => {
                const newQuestions = [...questions];

                currentQuestion.answers.forEach(
                  (answer) => (answer.isCorrect = false)
                );
                currentQuestion.answers[i]!.isCorrect = true;
                setQuestions(newQuestions);
              }}
            />
            <Input
              placeholder={String.fromCharCode(65 + i)}
              value={answer.name}
              onChange={(e) => {
                const newQuestions = [...questions];
                currentQuestion.answers[i]!.name = e.target.value;
                setQuestions(newQuestions);
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
