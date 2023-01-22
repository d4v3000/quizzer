import { Bars3Icon, TrashIcon } from "@heroicons/react/24/outline";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { IQuestion } from "../../models/question";
import DeleteModal from "./DeleteModal";
import IconTypes from "./IconTypes";

interface IProps {
  title: string;
  type: string;
  i: number;
  setQuestions: Dispatch<SetStateAction<IQuestion[]>>;
}

const ScrollElement: FC<IProps> = ({ title, type, i, setQuestions }) => {
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <div
      className="mr-4 flex items-center gap-2"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <TrashIcon
        className={`h-7 w-7 cursor-pointer ${hovered ? "" : "invisible"}`}
        onClick={() => setOpen(true)}
      />
      <div className="flex w-full items-center justify-between gap-2 rounded-md border-2 border-zinc-500 px-2 py-1">
        <p>
          {`${i}. `} {title}
        </p>
        <IconTypes type={type} />
      </div>
      <Bars3Icon
        className={`h-7 w-7 cursor-pointer ${hovered ? "" : "invisible"}`}
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
