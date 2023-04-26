import { Bars3Icon, TrashIcon } from "@heroicons/react/24/outline";
import { FC, useState } from "react";
import IconTypes from "./IconTypes";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useQuizStore } from "@utils/zustand/quizStore";
import DeleteQuestionModal from "./DeleteQuestionModal";

interface IProps {
  title: string;
  type: string;
  i: number;
  width: number;
}

const ScrollElement: FC<IProps> = ({ title, type, i, width }) => {
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
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      ref={setNodeRef}
      style={style}
    >
      <div
        className="flex w-full items-center gap-2 p-2"
        style={{ maxWidth: width }}
      >
        <TrashIcon
          className={`h-8 w-8 cursor-pointer stroke-2 ${
            hovered ? "" : "invisible"
          }`}
          onClick={() => setOpen(true)}
        />
        <div
          className={`${
            currentQuestion === i
              ? "bg-gradient-to-r from-indigo-600 to-violet-700"
              : "bg-zinc-500"
          } w-full cursor-pointer overflow-auto rounded-md p-[3px]`}
          onClick={() => setCurrentQuestion(i)}
        >
          <div className="flex w-full gap-2 bg-zinc-900 p-1">
            <div className="w-full truncate">
              {`${i + 1}. `} {title}
            </div>
            <IconTypes type={type} />
          </div>
        </div>
        <Bars3Icon
          className={`h-8 w-8 cursor-pointer stroke-2 ${
            hovered ? "" : "invisible"
          }`}
          {...attributes}
          {...listeners}
        />
      </div>
      <DeleteQuestionModal open={open} setOpen={setOpen} index={i} />
    </div>
  );
};

export default ScrollElement;
