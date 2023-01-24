import { XMarkIcon } from "@heroicons/react/24/outline";
import Button from "@ui/Button";
import Input from "@ui/Input";
import { useQuizStore } from "@utils/zustand/quizStore";
import { useState } from "react";
import GuessingEditor from "./GuessingEditor";
import LocationEditor from "./LocationEditor";
import QuestionEditor from "./QuestionEditor";

const EditQuestion = () => {
  const questions = useQuizStore((state) => state.questions);
  const currentQuestion = useQuizStore((state) => state.currentQuestion);

  const [imgUrl, setImgUrl] = useState("");
  const [showImg, setShowImg] = useState(false);

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
        placeholder="Name of the question"
        onChange={(e) => handleNameChange(e)}
        value={questions[currentQuestion]?.title}
      />
      {!showImg && (
        <>
          <div className="flex w-full items-center gap-2 py-2">
            <p className="min-w-fit pr-2 text-sm font-semibold uppercase italic text-zinc-400">
              Image
            </p>
            <hr className="border-1 w-full border-zinc-400" />
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Link to image"
              value={questions[currentQuestion]?.imgUrl}
              onChange={(e) => {
                setImgUrl(e.target.value);
              }}
            />
            <Button
              intent="secondary"
              size="medium"
              onClick={() => setShowImg(true)}
            >
              Apply
            </Button>
          </div>
        </>
      )}
      {showImg && (
        <div className="relative mx-auto my-4 flex h-fit w-fit">
          <img src={imgUrl} alt="" className="max-h-96" />
          <XMarkIcon
            className="absolute top-1 right-1 h-6 w-6 cursor-pointer stroke-black"
            onClick={() => {
              setShowImg(false);
              setImgUrl("");
            }}
          />
        </div>
      )}
      {questions[currentQuestion]?.type === "guessing" && <GuessingEditor />}
      {questions[currentQuestion]?.type === "location" && <LocationEditor />}
      {questions[currentQuestion]?.type === "question" && <QuestionEditor />}
    </div>
  );
};

export default EditQuestion;
