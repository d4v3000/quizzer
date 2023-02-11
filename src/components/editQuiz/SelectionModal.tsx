import { useTransition, animated, config } from "@react-spring/web";
import * as Dialog from "@radix-ui/react-dialog";
import TypeBox from "./TypeBox";
import IconTypes from "./IconTypes";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Dispatch, FC, SetStateAction } from "react";
import {
  IGuessingAnswer,
  ILocationAnswer,
  IQuestion,
  IQuestionAnswer,
} from "../../models/question";
import { useQuizStore } from "@utils/zustand/quizStore";
import { title } from "process";

interface IProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SelectionModal: FC<IProps> = ({ open, setOpen }) => {
  const transitions = useTransition(open, {
    from: { opacity: 0, scale: 0 },
    enter: { opacity: 1, scale: 1, y: "-50%", x: "-50%" },
    leave: { opacity: 0, scale: 0 },
    config: config.stiff,
  });

  const questions = useQuizStore((state) => state.questions);
  const setQuestions = useQuizStore((state) => state.setQuestions);
  const setCurrentQuestion = useQuizStore((state) => state.setCurrentQuestion);

  const handleClick = (type: string) => {
    let newQuestion: IQuestion = {
      type,
      title: "",
      imgUrl: "",
      sourceUrl: "",
    };
    if (type === "guessing") {
      (newQuestion as IGuessingAnswer).answer = undefined;
    } else if (type === "location") {
      (newQuestion as ILocationAnswer).answer = {
        x: 0,
        y: 0,
      };
    } else if (type === "question") {
      (newQuestion as IQuestionAnswer).answers = [
        { id: "A", title: "", correct: true },
        { id: "B", title: "", correct: false },
        { id: "C", title: "", correct: false },
        { id: "D", title: "", correct: false },
      ];
    }
    setQuestions([
      ...questions,
      newQuestion as IGuessingAnswer | ILocationAnswer | IQuestionAnswer,
    ]);
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
    {
      type: "guessing",
      name: "Guessing",
    },
  ];

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {transitions((styles, item) =>
        item ? (
          <>
            <Dialog.Overlay
              forceMount
              asChild
              className="fixed inset-0 bg-black bg-opacity-40"
            >
              <animated.div
                style={{
                  opacity: styles.opacity,
                }}
              />
            </Dialog.Overlay>
            <Dialog.Content
              forceMount
              asChild
              className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 rounded-md bg-zinc-700 px-16 py-8"
            >
              <animated.div style={styles}>
                <div className="flex flex-col items-center gap-3">
                  <Dialog.Close className="absolute top-0 right-0 p-2">
                    <XMarkIcon className="h-6 w-6" />
                  </Dialog.Close>
                  <p className="text-lg font-semibold uppercase">
                    Choose Round Type
                  </p>
                  <div className="flex gap-4">
                    {options.map((option) => (
                      <TypeBox
                        key={option.type}
                        onClick={() => handleClick(option.type)}
                      >
                        <IconTypes type={option.type} />
                        <p className="text-lg font-bold">{option.name}</p>
                      </TypeBox>
                    ))}
                  </div>
                </div>
              </animated.div>
            </Dialog.Content>
          </>
        ) : null
      )}
    </Dialog.Root>
  );
};

export default SelectionModal;
