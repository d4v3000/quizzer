import { useQuizStore } from "@utils/zustand/quizStore";
import { FC } from "react";
import EditQuestion from "./EditQuestion";
import Settings from "./Settings";

interface IProps {
  isSettingsOpen: boolean;
}

const Main: FC<IProps> = ({ isSettingsOpen }) => {
  const currentQuestion = useQuizStore((state) => state.currentQuestion);

  return (
    <div className="flex w-2/4 flex-col items-center justify-between p-10">
      {isSettingsOpen && currentQuestion === -1 ? (
        <Settings />
      ) : (
        <EditQuestion />
      )}
    </div>
  );
};

export default Main;
