import { ArrowPathRoundedSquareIcon } from "@heroicons/react/24/outline";
import Button from "@ui/Button";
import { FC, useEffect, useRef, useState } from "react";
import SelectionModal from "./SelectionModal";
import { useQuizStore } from "@utils/zustand/quizStore";
import QuestionList from "./QuestionList";

const SideBar: FC = () => {
  const [open, setOpen] = useState(false);
  const [scrollDown, setScrollDown] = useState(false);
  const numOfQuestions = useQuizStore((state) => state.questions.length);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollDown) {
      scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
      setScrollDown(false);
    }
  }, [scrollDown]);

  return (
    <>
      <div className="flex w-full p-2">
        <div className="flex w-full items-center justify-center gap-2">
          <ArrowPathRoundedSquareIcon className="h-6 w-6" />
          <p>{`${numOfQuestions} Questions`}</p>
        </div>
      </div>
      <div className="flex h-[80%] w-full flex-col gap-2">
        <QuestionList ref={scrollRef} />
      </div>
      <div className="flex h-fit w-full flex-col items-center gap-2">
        <hr className="border-1 w-full border-zinc-400" />
        <Button intent="secondary" size="small" onClick={() => setOpen(true)}>
          Add Round
        </Button>
        <SelectionModal
          open={open}
          setOpen={setOpen}
          customFun={() => setScrollDown(true)}
        />
      </div>
    </>
  );
};

export default SideBar;
