import Input from "@ui/Input";
import * as Slider from "@radix-ui/react-slider";
import {
  ChevronDownIcon,
  ChevronUpDownIcon,
  ChevronUpIcon,
  ListBulletIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import Select from "@ui/Select";

const FilterBar = () => {
  const [sortByFilter, setSortByFilter] = useState("Created At");
  const [isAsc, setIsAsc] = useState(true);
  const [currentView, setCurrentView] = useState<"grid" | "list">("grid");
  const [itemsPerPage, SetItemsPerPage] = useState("20");
  const [numOfCols, setNumOfCols] = useState<number[]>([3]);

  return (
    <div className="flex w-full gap-4">
      <Input className="w-1/5" placeholder="Search..." />
      <div className="flex items-center gap-1 rounded-md bg-zinc-800 text-zinc-200">
        <Select
          value={sortByFilter}
          onValueChange={setSortByFilter}
          items={["Created At", "Teams", "Questions"]}
        />
        <div
          onClick={() => setIsAsc(!isAsc)}
          className="flex h-full cursor-pointer items-center justify-center rounded-md p-2 hover:bg-zinc-700"
        >
          {isAsc ? (
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
          items={["20", "30", "40"]}
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