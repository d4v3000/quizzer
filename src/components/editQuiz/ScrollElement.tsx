import { Bars3Icon, TrashIcon } from "@heroicons/react/24/outline";
import { FC, useState } from "react";
import IconTypes from "./IconTypes";

interface IProps {
  title: string;
  type: string;
  i: number;
}

const ScrollElement: FC<IProps> = ({ title, type, i }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="mr-4 flex items-center gap-2"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <TrashIcon
        className={`h-7 w-7 cursor-pointer ${hovered ? "" : "invisible"}`}
      />
      <div className="flex w-full items-center justify-between gap-2 rounded-md border-2 border-zinc-300 px-2 py-1">
        <p>
          {`${i}. `} {title}
        </p>
        <IconTypes type={type} />
      </div>
      <Bars3Icon
        className={`h-7 w-7 cursor-pointer ${hovered ? "" : "invisible"}`}
      />
    </div>
  );
};

export default ScrollElement;
