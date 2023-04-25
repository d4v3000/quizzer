import Label from "@ui/Label";
import { LoadingSpinner } from "@ui/Loader";
import { trpc } from "@utils/trpc";
import { Dispatch, FC, SetStateAction, useEffect } from "react";

interface IProps {
  setQuiz: Dispatch<
    SetStateAction<
      | {
          id: string;
          numOfQuestions: string;
          title: string;
        }
      | undefined
    >
  >;
}

const AllQuizzesSelect: FC<IProps> = ({ setQuiz }) => {
  const getQuizzes = trpc.quiz.getAllQuizzes.useQuery();

  useEffect(() => {
    getQuizzes.refetch();
  }, []);

  return (
    <div className="flex flex-col items-center gap-2">
      <Label text="Quiz" />
      {getQuizzes.isLoading ? (
        <LoadingSpinner />
      ) : (
        <select
          className="w-full rounded-md border border-transparent bg-zinc-700 p-3 text-base text-zinc-200 focus:outline-none"
          onChange={(e) => setQuiz(JSON.parse(e.target.value))}
        >
          {getQuizzes.data?.map((quiz) => (
            <option
              key={quiz.id}
              value={`{"id": "${quiz.id}","title": "${
                quiz.title
              }","numOfQuestions": "${quiz._count.questions.toString()}"}`}
            >
              {quiz.title}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default AllQuizzesSelect;
