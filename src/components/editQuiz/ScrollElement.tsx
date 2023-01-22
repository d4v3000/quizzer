import { Bars3Icon, TrashIcon } from "@heroicons/react/24/outline";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { IQuestion } from "../../models/question";
import DeleteModal from "./DeleteModal";
import IconTypes from "./IconTypes";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface IProps {
  title: string;
  type: string;
  i: number;
  setQuestions: Dispatch<SetStateAction<IQuestion[]>>;
}

const ScrollElement: FC<IProps> = ({ title, type, i, setQuestions }) => {
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);

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
      <div className="flex w-full items-center justify-between gap-2 rounded-md border-2 border-zinc-500 px-2 py-1">
        <p>
          {`${i + 1}. `} {title}
        </p>
        <IconTypes type={type} />
      </div>
      <Bars3Icon
        className={`h-7 w-7 cursor-pointer stroke-2 ${
          hovered ? "" : "invisible"
        }`}
        {...attributes}
        {...listeners}
      />
      <DeleteModal
        open={open}
        setOpen={setOpen}
        setQuestions={setQuestions}
        index={i - 1}
      />
    </div>
  );
};

export default ScrollElement;
