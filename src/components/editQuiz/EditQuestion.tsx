import { XMarkIcon } from "@heroicons/react/24/outline";
import Button from "@ui/Button";
import Input from "@ui/Input";
import Label from "@ui/Label";
import { useQuizStore } from "@utils/zustand/quizStore";
import { useEffect, useState } from "react";
import GuessingEditor from "./GuessingEditor";
import LocationEditor from "./LocationEditor";
import QuestionEditor from "./QuestionEditor";

const EditQuestion = () => {
  const questions = useQuizStore((state) => state.questions);
  const currentQuestion = useQuizStore((state) => state.currentQuestion);

  const [imgUrl, setImgUrl] = useState("");
  const [showImg, setShowImg] = useState(false);

  useEffect(() => {
    questions[currentQuestion]?.imgUrl !== ""
      ? setShowImg(true)
      : setShowImg(false);
  }, [currentQuestion, questions]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuestions = [...questions];
    newQuestions[currentQuestion]!.title = e.target.value;
    useQuizStore.setState({ questions: newQuestions });
  };

  const handleImgChange = () => {
    const newQuestions = [...questions];
    newQuestions[currentQuestion]!.imgUrl = imgUrl;
    useQuizStore.setState({ questions: newQuestions });
    setShowImg(true);
    setImgUrl("");
  };

  return (
    <div className="flex w-full flex-col">
      <Label text="Question" />
      <Input
        placeholder="Name of the question"
        onChange={(e) => handleNameChange(e)}
        value={questions[currentQuestion]?.title}
      />
      {!showImg && (
        <>
          <Label text="Image" />

          <div className="flex gap-2">
            <Input
              placeholder="Link to image"
              value={imgUrl}
              onChange={(e) => {
                setImgUrl(e.target.value);
              }}
            />
            <Button intent="secondary" size="medium" onClick={handleImgChange}>
              Apply
            </Button>
          </div>
        </>
      )}
      {showImg &&
        (questions[currentQuestion]?.type === "location" ? (
          <LocationEditor>
            <img
              src={questions[currentQuestion]?.imgUrl}
              alt=""
              className="w-fit"
            />
            <XMarkIcon
              className="absolute top-1 right-1 h-6 w-6 cursor-pointer stroke-black"
              onClick={() => {
                setShowImg(false);
                setImgUrl("");
              }}
            />
          </LocationEditor>
        ) : (
          <div className="relative mx-auto my-4 flex h-fit w-fit">
            <img
              src={questions[currentQuestion]?.imgUrl}
              alt=""
              className="w-fit"
            />
            <XMarkIcon
              className="absolute top-1 right-1 h-6 w-6 cursor-pointer stroke-black"
              onClick={() => {
                setShowImg(false);
                setImgUrl("");
              }}
            />
          </div>
        ))}
      {questions[currentQuestion]?.type === "guessing" && <GuessingEditor />}
      {questions[currentQuestion]?.type === "question" && <QuestionEditor />}
    </div>
  );
};

export default EditQuestion;
