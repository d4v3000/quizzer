import {
  ArrowPathRoundedSquareIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import Button from "@ui/Button";
import { isUndefined } from "lodash";
import { FC, useState } from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import SelectionModal from "./SelectionModal";
import ScrollElement from "./ScrollElement";
import { IQuestion } from "../../models/question";

interface IProps {
  numTeams: number | undefined;
}

const SideBar: FC<IProps> = ({ numTeams }) => {
  const [open, setOpen] = useState(false);
  const [questions, setQuestions] = useState<IQuestion[]>([]);

  return (
    <>
      <div className="flex w-full p-2">
        <div className="flex w-full items-center gap-2">
          <UserGroupIcon className="h-6 w-6" />
          <p>{isUndefined(numTeams) ? 1 : numTeams} Teams</p>
        </div>
        <div className="flex w-full items-center justify-end gap-2">
          <ArrowPathRoundedSquareIcon className="h-6 w-6" />
          <p>{`${questions.length} Rounds`}</p>
        </div>
      </div>
      <ScrollArea.Root
        className="h-full w-full overflow-hidden p-2"
        type="auto"
      >
        <ScrollArea.Viewport className="h-full w-full">
          <div className="flex flex-col gap-1">
            {questions.map((question, i) => (
              <ScrollElement
                title={question.title}
                type={question.type}
                i={i + 1}
                setQuestions={setQuestions}
              />
            ))}
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          orientation="vertical"
          className="my-2 flex rounded-md bg-zinc-600 p-1"
        >
          <ScrollArea.Thumb className="relative flex rounded-2xl border-4 border-zinc-900" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
      <div className="flex h-fit w-full flex-col items-center">
        <hr className="border-1 w-full border-zinc-400" />
        <Button intent="secondary" size="small" onClick={() => setOpen(true)}>
          Add Round
        </Button>
        <SelectionModal
          open={open}
          setOpen={setOpen}
          setQuestions={setQuestions}
          questions={questions}
        />
      </div>
    </>
  );
};

export default SideBar;
