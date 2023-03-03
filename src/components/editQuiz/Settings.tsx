import Button from "@ui/Button";
import Input from "@ui/Input";
import Label from "@ui/Label";
import { useQuizStore } from "@utils/zustand/quizStore";
import { toNumber } from "lodash";

const Settings = () => {
  const quizName = useQuizStore((state) => state.name);
  const setQuizName = useQuizStore((state) => state.setName);
  const numTeams = useQuizStore((state) => state.numTeams);
  const setNumTeams = useQuizStore((state) => state.setNumTeams);

  return (
    <>
      <div className="flex w-full flex-col">
        <Label text="Quiz Name" />
        <Input
          placeholder="Name of the quiz"
          onChange={(e) => setQuizName(e.target.value)}
          value={quizName}
        />
        <Label text="Number of Teams" />
        <select
          className="w-full rounded-md border border-transparent bg-zinc-800 p-3 text-base focus:outline-none"
          value={numTeams}
          onChange={(e) => setNumTeams(toNumber(e.target.value))}
        >
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
        </select>
      </div>
      <div className="flex w-full flex-col items-center">
        <Label text="Delete Quiz" />
        <Button size="large" intent="danger" className="w-1/4">
          Delete
        </Button>
      </div>
    </>
  );
};

export default Settings;
