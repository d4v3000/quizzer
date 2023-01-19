import Link from "next/link";
import React from "react";
import { trpc } from "../../utils/trpc";

function Quiz() {
  const getQuizzes = trpc.quiz.getUserQuizzes.useQuery();

  return (
    <div className="flex h-[calc(100vh-57px)] flex-col bg-zinc-900 text-gray-200">
      {getQuizzes.data?.map((quiz) => (
        <Link key={quiz.id} href={`/quiz/${quiz.id}/edit`}>
          <div className="flex h-full flex-col px-10 py-4">{quiz.title}</div>
        </Link>
      ))}
    </div>
  );
}

export default Quiz;
