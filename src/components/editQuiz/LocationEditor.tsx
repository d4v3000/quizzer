import { MapPinIcon } from "@heroicons/react/24/outline";
import { useQuizStore } from "@utils/zustand/quizStore";
import { FC, MouseEvent, ReactNode, useState } from "react";

interface IProps {
  children: ReactNode;
}

const LocationEditor: FC<IProps> = ({ children }) => {
  const [markerPos, setMakerPos] = useState({ x: -1, y: -1 });
  const questions = useQuizStore((state) => state.questions);
  const currentQuestion = useQuizStore((state) => state.currentQuestion);

  const handleMouseClick = (e: MouseEvent) => {
    let rect = e.currentTarget.getBoundingClientRect();
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;
    const newQuestions = [...questions];
    questions[currentQuestion]!.answers[0]!.x = localX;
    questions[currentQuestion]!.answers[0]!.y = localY;
    useQuizStore.setState({ questions: newQuestions });
    setMakerPos({ x: localX, y: localY });
  };

  return (
    <div
      className="relative mx-auto my-4 flex h-fit w-fit"
      onClick={handleMouseClick}
    >
      {children}
      {(markerPos.x > -1 || markerPos.y > -1) && (
        <MapPinIcon
          style={{ top: markerPos.y - 20, left: markerPos.x - 10 }}
          className={`absolute h-5 w-5 stroke-black stroke-2`}
        />
      )}
    </div>
  );
};

export default LocationEditor;
