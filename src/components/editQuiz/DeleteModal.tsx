import { useTransition, animated, config } from "@react-spring/web";
import * as Dialog from "@radix-ui/react-dialog";
import { FC } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Button from "@ui/Button";
import { useQuizStore } from "@utils/zustand/quizStore";

interface IProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  index: number;
}

const DeleteModal: FC<IProps> = ({ open, setOpen, index }) => {
  const transitions = useTransition(open, {
    from: { opacity: 0, scale: 0 },
    enter: { opacity: 1, scale: 1, y: "-50%", x: "-50%" },
    leave: { opacity: 0, scale: 0 },
    config: config.stiff,
  });

  const questions = useQuizStore((state) => state.questions);
  const setQuestions = useQuizStore((state) => state.setQuestions);
  const currentQuestion = useQuizStore((state) => state.currentQuestion);
  const setCurrentQuestion = useQuizStore((state) => state.setCurrentQuestion);

  const handleClick = () => {
    setQuestions(questions.filter((_, i) => i !== index));
    setCurrentQuestion(currentQuestion - 1);
    setOpen(false);
  };

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
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-zinc-700 px-16 py-8"
            >
              <animated.div style={styles}>
                <div className="flex flex-col items-center gap-3">
                  <Dialog.Close className="absolute top-0 right-0 p-2">
                    <XMarkIcon className="h-6 w-6" />
                  </Dialog.Close>
                  <p className="text-xl font-bold">Remove round?</p>
                  <p className="text-lg font-semibold">
                    Do you want to remove this round?
                  </p>
                  <div className="flex gap-4">
                    <Button
                      intent="danger"
                      size="large"
                      onClick={() => handleClick()}
                    >
                      Remove Round
                    </Button>
                    <Button intent="secondary" size="large">
                      Cancel
                    </Button>
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

export default DeleteModal;
