import TypeBox from "./TypeBox";
import IconTypes from "./IconTypes";
import { FC } from "react";
import { IQuestion } from "../../models/question";
import { useQuizStore } from "@utils/zustand/quizStore";
import Modal from "@ui/Modal";

interface IProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  customFun?: () => void;
}

const SelectionModal: FC<IProps> = ({ open, setOpen, customFun }) => {
  const questions = useQuizStore((state) => state.questions);
  const setQuestions = useQuizStore((state) => state.setQuestions);
  const setCurrentQuestion = useQuizStore((state) => state.setCurrentQuestion);

  const handleClick = (type: "guessing" | "location" | "question") => {
    const newQuestion: IQuestion = {
      type,
      title: "",
      imgUrl: "",
      guessingAnswer: null,
      locationAnswer: null,
      multipleChoiceAnswers: null,
    };
    if (type === "guessing") {
      newQuestion.guessingAnswer = { answer: 0 };
    } else if (type === "location") {
      newQuestion.locationAnswer = { x: 0, y: 0 };
    } else if (type === "question") {
      newQuestion.multipleChoiceAnswers = {
        answers: [
          { name: "", isCorrect: true },
          { name: "", isCorrect: false },
          { name: "", isCorrect: false },
          { name: "", isCorrect: false },
        ],
      };
    }
    setQuestions([...questions, newQuestion]);
    setCurrentQuestion(questions.length);
    setOpen(false);
    if (customFun) {
      customFun();
    }
  };

  const options = [
    {
      type: "question",
      name: "Question",
    },
    {
      type: "location",
      name: "Location",
    },
    {
      type: "guessing",
      name: "Guessing",
    },
  ];

  return (
    <Modal open={open} setOpen={setOpen}>
      <p className="text-lg font-semibold uppercase">Choose Round Type</p>
      <div className="flex gap-4">
        {options.map((option) => (
          <TypeBox
            key={option.type}
            onClick={() =>
              handleClick(option.type as "guessing" | "location" | "question")
            }
            onKeyDown={(e) => {
              if (e.key === "Enter")
                handleClick(
                  option.type as "guessing" | "location" | "question"
                );
            }}
          >
            <IconTypes type={option.type} />
            <p className="text-lg font-bold">{option.name}</p>
          </TypeBox>
        ))}
      </div>
    </Modal>
  );
};

export default SelectionModal;
