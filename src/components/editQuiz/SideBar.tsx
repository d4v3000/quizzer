import {
  ArrowPathRoundedSquareIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import Button from "@ui/Button";
import { isUndefined, toNumber } from "lodash";
import { FC, useState } from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import SelectionModal from "./SelectionModal";
import ScrollElement from "./ScrollElement";
import { IQuestion } from "../../models/question";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import { useQuizStore } from "@utils/zustand/quizStore";

const SideBar: FC = () => {
  const [open, setOpen] = useState(false);
  const numTeams = useQuizStore((state) => state.numTeams);
  const questions = useQuizStore((state) => state.questions);
  const setQuestions = useQuizStore((state) => state.setQuestions);
  const currentQuestion = useQuizStore((state) => state.currentQuestion);
  const setCurrentQuestion = useQuizStore((state) => state.setCurrentQuestion);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setQuestions(
        arrayMove<IQuestion>(
          questions,
          toNumber(active.id) - 1,
          toNumber(over?.id) - 1
        )
      );
      if (currentQuestion === toNumber(active.id) - 1) {
        setCurrentQuestion(toNumber(over?.id) - 1);
      }
    }
  };

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
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          >
            <div className="flex flex-col gap-1">
              <SortableContext
                items={questions.map((question, i) => i + 1)}
                strategy={verticalListSortingStrategy}
              >
                {questions.map((question, i) => (
                  <ScrollElement
                    title={question.title}
                    type={question.type}
                    i={i}
                    key={i}
                  />
                ))}
              </SortableContext>
            </div>
          </DndContext>
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
        <SelectionModal open={open} setOpen={setOpen} />
      </div>
    </>
  );
};

export default SideBar;
