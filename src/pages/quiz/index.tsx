import NavBar from "@components/NavBar";
import QuizCard from "@components/quizView/QuizCard";
import Link from "next/link";
import React from "react";
import { trpc } from "../../utils/trpc";

function Quiz() {
  const getQuizzes = trpc.quiz.getUserQuizzes.useQuery();

  return (
    <>
      <NavBar />
      <div className="mx-auto grid w-3/5 gap-6 bg-zinc-900 py-10 text-gray-200 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {getQuizzes.data?.map((quiz) => (
          <QuizCard quiz={quiz} />
        ))}
      </div>
    </>
  );
}

export default Quiz;
