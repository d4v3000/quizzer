import { FC } from "react";
import Button from "@ui/Button";
import { useQuizStore } from "@utils/zustand/quizStore";
import Modal from "@ui/Modal";

interface IProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  index: number;
}

const DeleteQuestionModal: FC<IProps> = ({ open, setOpen, index }) => {
  const questions = useQuizStore((state) => state.questions);
  const setQuestions = useQuizStore((state) => state.setQuestions);
  const currentQuestion = useQuizStore((state) => state.currentQuestion);
  const setCurrentQuestion = useQuizStore((state) => state.setCurrentQuestion);

  const handleRemove = () => {
    setQuestions(questions.filter((_, i) => i !== index));
    setCurrentQuestion(currentQuestion - 1);
    setOpen(false);
  };

  return (
    <Modal open={open} setOpen={setOpen}>
      <p className="text-xl font-bold">Remove round?</p>
      <p className="text-lg font-semibold">Do you want to remove this round?</p>
      <div className="flex gap-4">
        <Button intent="danger" size="large" onClick={() => handleRemove()}>
          Remove Round
        </Button>
        <Button intent="secondary" size="large" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteQuestionModal;
