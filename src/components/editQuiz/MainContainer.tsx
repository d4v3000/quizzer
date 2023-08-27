import { useQuizStore } from "@utils/zustand/quizStore";
import EditQuestion from "./EditQuestion";
import Settings from "./Settings";

const MainContainer = () => {
  const currentQuestion = useQuizStore((state) => state.currentQuestion);

  return (
    <div className="mx-auto flex w-full flex-col items-center justify-between px-4 lg:w-5/6 lg:px-6 xl:w-3/4 xl:px-10">
      {currentQuestion === -1 ? <Settings /> : <EditQuestion />}
    </div>
  );
};

export default MainContainer;
