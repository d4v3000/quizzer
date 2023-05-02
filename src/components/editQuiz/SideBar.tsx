import {
  ArrowPathRoundedSquareIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import Button from "@ui/Button";
import { isUndefined, toNumber } from "lodash";
import { FC, useEffect, useRef, useState } from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import SelectionModal from "./SelectionModal";
import ScrollElement from "./ScrollElement";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  PointerSensor,
  useSensor,
} from "@dnd-kit/core";
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
import { IQuestion } from "../../models/question";

const SideBar: FC = () => {
  const [open, setOpen] = useState(false);
  const [width, setWidth] = useState<number>(0);
  const [scrollDown, setScrollDown] = useState(false);
  const questions = useQuizStore((state) => state.questions);
  const setQuestions = useQuizStore((state) => state.setQuestions);
  const currentQuestion = useQuizStore((state) => state.currentQuestion);
  const setCurrentQuestion = useQuizStore((state) => state.setCurrentQuestion);

  const ref = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const sensor = useSensor(PointerSensor);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const activeIndex = toNumber(active.id) - 1;
    const overIndex = toNumber(over?.id) - 1;

    if (active.id !== over?.id) {
      setQuestions(arrayMove<IQuestion>(questions, activeIndex, overIndex));

      if (currentQuestion === activeIndex) {
        // current question is dragged
        setCurrentQuestion(overIndex);
      } else if (
        activeIndex > currentQuestion &&
        overIndex <= currentQuestion
      ) {
        // question under current question gets dragged above
        setCurrentQuestion(currentQuestion + 1);
      } else if (
        activeIndex < currentQuestion &&
        overIndex >= currentQuestion
      ) {
        // question over current question gets dragged below
        setCurrentQuestion(currentQuestion - 1);
      }
    }
  };

  useEffect(() => {
    if (ref.current) {
      setWidth(ref.current.offsetWidth);
    }

    const getwidth = () => {
      setWidth(ref!.current!.offsetWidth);
    };

    window.addEventListener("resize", getwidth);
    return () => window.removeEventListener("resize", getwidth);
  }, []);

  useEffect(() => {
    if (scrollDown) {
      scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
      setScrollDown(false);
    }
  }, [scrollDown]);

  return (
    <>
      <div className="flex w-full p-2">
        <div className="flex w-full items-center justify-center gap-2">
          <ArrowPathRoundedSquareIcon className="h-6 w-6" />
          <p>{`${questions.length} Questions`}</p>
        </div>
      </div>
      <div className="flex h-[80%] w-full flex-col gap-2">
        <ScrollArea.Root type="auto" className="h-full overflow-hidden">
          <ScrollArea.Viewport
            ref={ref}
            className="h-full data-[state=visible]:mr-2"
          >
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis, restrictToParentElement]}
              sensors={[sensor]}
            >
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
                    width={width}
                  />
                ))}
              </SortableContext>
            </DndContext>
            <div ref={scrollRef} />
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar
            orientation="vertical"
            className="my-2 ml-2 flex rounded-md bg-zinc-600 p-1"
          >
            <ScrollArea.Thumb className="relative flex rounded-2xl border-4 border-zinc-900" />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </div>
      <div className="flex h-fit w-full flex-col items-center">
        <hr className="border-1 w-full border-zinc-400" />
        <Button intent="secondary" size="small" onClick={() => setOpen(true)}>
          Add Round
        </Button>
        <SelectionModal
          open={open}
          setOpen={setOpen}
          customFun={() => setScrollDown(true)}
        />
      </div>
    </>
  );
};

export default SideBar;
