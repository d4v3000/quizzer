import Input from "@ui/Input";
import Label from "@ui/Label";
import { useQuizStore } from "@utils/zustand/quizStore";
import { toNumber } from "lodash";

const GuessingEditor = () => {
  const questions = useQuizStore((state) => state.questions);
  const currentQuestionIndex = useQuizStore((state) => state.currentQuestion);
  const setQuestions = useQuizStore((state) => state.setQuestions);
  const currentQuestion = useQuizStore(
    (state) => state.questions[currentQuestionIndex]
  );

  return (
    <>
      <Label text="Answer" />
      <Input
        placeholder="Enter the correct number"
        type="number"
        value={currentQuestion!.guessingAnswer!.answer}
        onChange={(e) => {
          const newQuestions = [...questions];
          newQuestions[currentQuestionIndex]!.guessingAnswer!.answer = toNumber(
            e.target.value
          );
          setQuestions(newQuestions);
        }}
      />
    </>
  );
};

export default GuessingEditor;
