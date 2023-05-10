import { XMarkIcon } from "@heroicons/react/24/outline";
import Input from "@ui/Input";
import Label from "@ui/Label";
import { useQuizStore } from "@utils/zustand/quizStore";
import GuessingEditor from "./GuessingEditor";
import LocationEditor from "./LocationEditor";
import QuestionEditor from "./QuestionEditor";
import Image from "next/image";
import ImageUploader from "./ImageUploader";

const EditQuestion = () => {
  const currentQuestionIndex = useQuizStore((state) => state.currentQuestion);
  const setQuestions = useQuizStore((state) => state.setQuestions);
  const questions = useQuizStore((state) => state.questions);
  const currentQuestion = useQuizStore(
    (state) => state.questions[currentQuestionIndex]
  );

  const imgUrl = currentQuestion?.imgUrl;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuestions = [...questions];
    newQuestions[currentQuestionIndex]!.title = e.target.value;
    setQuestions(newQuestions);
  };

  return (
    <div className="flex h-full w-full flex-col">
      <Label text="Question" />
      <Input
        placeholder="Name of the question"
        onChange={(e) => handleNameChange(e)}
        value={currentQuestion?.title}
      />
      {!imgUrl && <ImageUploader />}
      {imgUrl && (
        <div className="relative my-4 h-52 w-full overflow-hidden md:h-72 lg:h-96">
          <Image
            src={imgUrl!}
            alt="question-image"
            fill
            className="relative h-full w-fit object-contain"
            sizes="100vw"
          />
          <XMarkIcon
            className="absolute right-1 top-1 h-6 w-6 cursor-pointer rounded-full bg-black stroke-white"
            onClick={() => {
              const newQuestions = [...questions];
              newQuestions[currentQuestionIndex]!.imgUrl = "";
              setQuestions(newQuestions);
            }}
          />
        </div>
      )}
      {currentQuestion?.type === "guessing" && <GuessingEditor />}
      {currentQuestion?.type === "question" && <QuestionEditor />}
      {currentQuestion?.type === "location" && <LocationEditor />}
    </div>
  );
};

export default EditQuestion;
