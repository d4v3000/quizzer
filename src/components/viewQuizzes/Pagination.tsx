import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from "@heroicons/react/20/solid";
import { FC } from "react";

const Pagination = () => {
  const items = [
    { text: "1", active: true },
    { text: "2", active: false },
    { text: "3", active: false },
  ];
  return (
    <div className="flex justify-center">
      <nav className="w-full">
        <ul className="list-style-none flex w-full justify-between">
          <PaginationNavigator isPrev={true} active={false} />
          <div className="flex gap-2">
            {items.map((item, i) => (
              <PaginationItem
                active={item.active}
                text={item.text}
                key={`pagination_${i}`}
              />
            ))}
          </div>
          <PaginationNavigator isPrev={false} active={true} />
        </ul>
      </nav>
    </div>
  );
};

interface ItemProps {
  text: string;
  active: boolean;
}

const PaginationItem: FC<ItemProps> = ({ text, active }) => {
  return (
    <li>
      <a
        className={`${
          active
            ? "border-t-2 border-indigo-600 text-indigo-600"
            : "cursor-pointer rounded-md bg-transparent text-zinc-400 hover:bg-zinc-800"
        } relative block py-1.5 px-3 text-lg font-medium transition-all duration-300`}
      >
        {text}
      </a>
    </li>
  );
};

interface NavigatorProps {
  isPrev: boolean;
  active: boolean;
}

const PaginationNavigator: FC<NavigatorProps> = ({ isPrev, active }) => {
  return (
    <li>
      <a
        className={`inline-flex ${
          active
            ? "cursor-pointer text-zinc-400"
            : "pointer-events-none text-zinc-500"
        } items-center gap-4 rounded bg-transparent py-1.5 px-3 text-lg transition-all duration-300 hover:bg-zinc-800`}
      >
        {isPrev ? (
          <>
            <ArrowLongLeftIcon className="h-6 w-6" />
            Previous
          </>
        ) : (
          <>
            Next
            <ArrowLongRightIcon className="h-6 w-6" />
          </>
        )}
      </a>
    </li>
  );
};

export default Pagination;
