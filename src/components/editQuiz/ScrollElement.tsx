import { Bars3Icon, TrashIcon } from "@heroicons/react/24/outline";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { IQuestion } from "../../models/question";
import DeleteModal from "./DeleteModal";
import IconTypes from "./IconTypes";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useQuizStore } from "@utils/zustand/quizStore";

interface IProps {
  title: string;
  type: string;
  i: number;
}

const ScrollElement: FC<IProps> = ({ title, type, i }) => {
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);
  const setCurrentQuestion = useQuizStore((state) => state.setCurrentQuestion);
  const currentQuestion = useQuizStore((state) => state.currentQuestion);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: i + 1,
      transition: null,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className="mr-4 flex items-center gap-2"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      ref={setNodeRef}
      style={style}
    >
      <TrashIcon
        className={`h-7 w-7 cursor-pointer stroke-2 ${
          hovered ? "" : "invisible"
        }`}
        onClick={() => setOpen(true)}
      />
      <div
        className={`${
          currentQuestion === i
            ? "bg-gradient-to-r from-indigo-600 to-violet-700"
            : "bg-zinc-500"
        } w-full cursor-pointer rounded-md p-[3px]`}
        onClick={() => setCurrentQuestion(i)}
      >
        <div className="flex h-full w-full items-center justify-between gap-2 bg-zinc-900 p-1">
          <p className="w-full truncate">
            {`${i + 1}. `} {title}
          </p>
          <IconTypes type={type} />
        </div>
      </div>
      <Bars3Icon
        className={`h-7 w-7 cursor-pointer stroke-2 ${
          hovered ? "" : "invisible"
        }`}
        {...attributes}
        {...listeners}
      />
      <DeleteModal open={open} setOpen={setOpen} index={i} />
    </div>
  );
};

export default ScrollElement;
