import TypeBox from "./TypeBox";
import IconTypes from "./IconTypes";
import { FC } from "react";
import { IQuestion } from "../../models/question";
import { useQuizStore } from "@utils/zustand/quizStore";
import Modal from "@ui/Modal";

interface IProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SelectionModal: FC<IProps> = ({ open, setOpen }) => {
  const questions = useQuizStore((state) => state.questions);
  const setQuestions = useQuizStore((state) => state.setQuestions);
  const setCurrentQuestion = useQuizStore((state) => state.setCurrentQuestion);

  const handleClick = (type: "guessing" | "location" | "question") => {
    let newQuestion: IQuestion = {
      type,
      title: "",
      imgUrl: "",
      answers: [],
    };
    if (type === "guessing") {
      newQuestion.answers = [];
    } else if (type === "location") {
      newQuestion.answers = [
        {
          x: 0,
          y: 0,
        },
      ];
    } else if (type === "question") {
      newQuestion.answers = [
        { placeholder: "A", title: "", isCorrect: true },
        { placeholder: "B", title: "", isCorrect: false },
        { placeholder: "C", title: "", isCorrect: false },
        { placeholder: "D", title: "", isCorrect: false },
      ];
    }
    setQuestions([...questions, newQuestion]);
    setCurrentQuestion(questions.length);
    setOpen(false);
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
    // Currently broken, uncomment after db schema changes
    // {
    //   type: "guessing",
    //   name: "Guessing",
    // },
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
