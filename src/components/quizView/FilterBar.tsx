import Input from "@ui/Input";
import * as Slider from "@radix-ui/react-slider";
import {
  ChevronDownIcon,
  ChevronUpDownIcon,
  ChevronUpIcon,
  ListBulletIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { Dispatch, FC, useEffect, useMemo, useState } from "react";
import Select from "@ui/Select";
import { debounce } from "lodash";

interface IProps {
  orderBy: string;
  setOrderBy: any;
  orderDir: string;
  setOrderDir: any;
  setSearch: Dispatch<React.SetStateAction<string>>;
}

const FilterBar: FC<IProps> = ({
  orderBy,
  setOrderBy,
  orderDir,
  setOrderDir,
  setSearch,
}) => {
  const [currentView, setCurrentView] = useState<"grid" | "list">("grid");
  const [itemsPerPage, SetItemsPerPage] = useState("9");
  const [numOfCols, setNumOfCols] = useState<number[]>([3]);

  const changeHandler = (event: any) => {
    setSearch(event.target.value);
  };

  const debouncedChangeHandler = useMemo(
    () => debounce(changeHandler, 400),
    []
  );

  useEffect(() => {
    return () => {
      debouncedChangeHandler.cancel();
    };
  }, []);

  return (
    <div className="flex w-full gap-4">
      <Input
        onChange={debouncedChangeHandler}
        className="w-1/5"
        placeholder="Search..."
      />
      <div className="flex items-center gap-1 rounded-md bg-zinc-800 text-zinc-200">
        <Select
          value={orderBy}
          onValueChange={setOrderBy}
          items={[
            { value: "createdAt", text: "Created At" },
            { value: "numberTeams", text: "Teams" },
            { value: "title", text: "Title" },
            { value: "updatedAt", text: "Updated At" },
            { value: "questions", text: "Questions" },
          ]}
        />
        <div
          onClick={() => setOrderDir(orderDir === "desc" ? "asc" : "desc")}
          className="flex h-full cursor-pointer items-center justify-center rounded-md p-2 hover:bg-zinc-700"
        >
          {orderDir === "desc" ? (
            <ChevronDownIcon className="h-6 w-6" />
          ) : (
            <ChevronUpIcon className="h-6 w-6" />
          )}
        </div>
      </div>
      <div className="flex items-center gap-1 rounded-md bg-zinc-800 text-zinc-200">
        <Select
          value={itemsPerPage}
          onValueChange={SetItemsPerPage}
          items={[
            { value: "9", text: "9" },
            { value: "18", text: "18" },
            { value: "27", text: "27" },
          ]}
          icon={<ChevronUpDownIcon className="h-4 w-4" />}
        />
      </div>
      <div className="flex items-center gap-1 rounded-md bg-zinc-800 text-zinc-200">
        <div
          onClick={() => setCurrentView("grid")}
          className={`flex h-full cursor-pointer items-center justify-center rounded-md p-2 ${
            currentView === "grid" && "bg-zinc-700"
          }`}
        >
          <Squares2X2Icon className="h-6 w-6" />
        </div>
        <div
          onClick={() => setCurrentView("list")}
          className={`flex h-full cursor-pointer items-center justify-center rounded-md p-2 ${
            currentView === "list" && "bg-zinc-700"
          }`}
        >
          <ListBulletIcon className="h-6 w-6" />
        </div>
      </div>
      <div className="flex items-center justify-center">
        <Slider.Root
          value={numOfCols}
          max={4}
          step={1}
          onValueChange={setNumOfCols}
          className="relative flex h-5 w-40 items-center"
        >
          <Slider.Track className="relative h-1 flex-grow rounded-md bg-zinc-800">
            <Slider.Range className="absolute h-full rounded-md bg-zinc-500" />
          </Slider.Track>
          <Slider.Thumb className="block h-5 w-5 cursor-pointer rounded-full bg-zinc-500" />
        </Slider.Root>
      </div>
    </div>
  );
};

export default FilterBar;
