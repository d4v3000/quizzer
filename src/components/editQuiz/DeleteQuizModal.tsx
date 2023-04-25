import Button from "@ui/Button";
import { LoadingSpinner } from "@ui/Loader";
import Modal from "@ui/Modal";
import { trpc } from "@utils/trpc";
import { useRouter } from "next/router";
import { FC } from "react";
import { toast } from "react-hot-toast";

interface IProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  id: string;
}

const DeleteQuizModal: FC<IProps> = ({ open, setOpen, id }) => {
  const router = useRouter();
  const ctx = trpc.useContext();
  const { mutate, isLoading } = trpc.quiz.deleteQuiz.useMutation({
    onSuccess: () => {
      setOpen(false);
      router.push("/quiz");
      ctx.quiz.getUserQuizzes.invalidate();
      toast.success("Quiz deleted succesfully");
    },
  });

  return (
    <Modal open={open} setOpen={setOpen}>
      <p className="text-xl font-bold">Remove quiz?</p>
      <p className="text-lg font-semibold">Do you want to remove this quiz?</p>
      <div className="flex gap-4">
        <Button
          intent="danger"
          size="large"
          onClick={() => mutate({ id: id })}
          disabled={isLoading}
        >
          {isLoading ? <LoadingSpinner /> : "Remove Quiz"}
        </Button>
        <Button intent="secondary" size="large" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteQuizModal;
