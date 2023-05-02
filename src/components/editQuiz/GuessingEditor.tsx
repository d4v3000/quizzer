import Input from "@ui/Input";
import Label from "@ui/Label";
import { useQuizStore } from "@utils/zustand/quizStore";
import { toNumber } from "lodash";

const GuessingEditor = () => {
  const questions = useQuizStore((state) => state.questions);
  const currentQuestion = useQuizStore(
    (state) => state.questions[state.currentQuestion]!.guessingAnswer!
  );
  const setQuestions = useQuizStore((state) => state.setQuestions);

  return (
    <>
      <Label text="Answer" />
      <Input
        placeholder="Enter the correct number"
        type={"number"}
        value={currentQuestion.answer}
        onChange={(e) => {
          const newQuestions = [...questions];
          currentQuestion.answer = toNumber(e.target.value);
          setQuestions(newQuestions);
        }}
      />
    </>
  );
};

export default GuessingEditor;
