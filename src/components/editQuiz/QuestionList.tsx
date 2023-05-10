import * as ScrollArea from "@radix-ui/react-scroll-area";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  TouchSensor,
  useSensors,
  useSensor,
  MouseSensor,
  KeyboardSensor,
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
import ScrollElement from "./ScrollElement";
import { useQuizStore } from "@utils/zustand/quizStore";
import { toNumber } from "lodash";
import { IQuestion } from "../../models/question";
import { forwardRef, useEffect, useRef, useState } from "react";

interface IProps {
  isShowing?: boolean;
}

const QuestionList = forwardRef<HTMLDivElement, IProps>(
  ({ isShowing }, forwardRef) => {
    const [width, setWidth] = useState<number>(0);

    const questions = useQuizStore((state) => state.questions);
    const setQuestions = useQuizStore((state) => state.setQuestions);
    const currentQuestion = useQuizStore((state) => state.currentQuestion);
    const setCurrentQuestion = useQuizStore(
      (state) => state.setCurrentQuestion
    );

    const ref = useRef<HTMLDivElement>(null);

    const mouseSensor = useSensor(MouseSensor);
    const touchSensor = useSensor(TouchSensor);
    const keyboardSensor = useSensor(KeyboardSensor);

    const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

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
    }, [isShowing]);

    return (
      <ScrollArea.Root type="auto" className="h-full w-full overflow-hidden">
        <ScrollArea.Viewport
          className="h-full w-full pl-2 lg:pl-0 lg:data-[state=visible]:mr-2"
          ref={ref}
        >
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            sensors={sensors}
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
          <div ref={forwardRef} />
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          orientation="vertical"
          className="my-2 ml-2 flex rounded-md bg-zinc-600 p-1"
        >
          <ScrollArea.Thumb className="relative flex rounded-2xl border-4 border-zinc-900" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    );
  }
);
QuestionList.displayName = "QuestionList";

export default QuestionList;
