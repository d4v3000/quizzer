import Input from "@ui/Input";
import Label from "@ui/Label";
import { useQuizStore } from "@utils/zustand/quizStore";

const GuessingEditor = () => {
  const questions = useQuizStore((state) => state.questions);
  const currentQuestion = useQuizStore((state) => state.currentQuestion);

  return (
    <>
      <Label text="Answer" />
      <Input
        placeholder="Enter the correct number"
        type={"number"}
        value={questions[currentQuestion]!.answers[0]!.title}
        onChange={(e) => {
          const newQuestions = [...questions];
          questions[currentQuestion]!.answers[0]!.title = e.target.value;
          useQuizStore.setState({ questions: newQuestions });
        }}
      />
    </>
  );
};

export default GuessingEditor;
