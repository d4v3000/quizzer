import {
  ArrowPathRoundedSquareIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Quiz } from "@prisma/client";
import Button from "@ui/Button";
import { isUndefined } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";

interface IProps {
  quiz: Quiz;
}

const QuizCard: FC<IProps> = ({ quiz }) => {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-2 rounded-md border border-zinc-700 p-4">
      <p className="text-2xl text-white">{quiz.title}</p>
      <div className="flex w-full p-2">
        <div className="flex w-full items-center gap-2">
          <UserGroupIcon className="h-6 w-6" />
          <p>{isUndefined(quiz.numberTeams) ? 1 : quiz.numberTeams} Teams</p>
        </div>
        <div className="flex w-full items-center justify-end gap-2">
          <ArrowPathRoundedSquareIcon className="h-6 w-6" />
          <p>{`1 Rounds`}</p>
        </div>
      </div>
      <div className="flex w-full justify-between gap-2">
        <Button
          intent="secondary"
          className="w-1/3 hover:scale-[1.03]"
          size="medium"
        >
          Play
        </Button>
        <Link href={`/quiz/${quiz.id}/edit`} className="w-1/3">
          <Button
            intent="secondary"
            className="w-full hover:scale-[1.03]"
            size="medium"
          >
            Edit
          </Button>
        </Link>
        <Button
          intent="danger"
          className="w-1/3 hover:scale-[1.03]"
          size="medium"
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default QuizCard;
