import NavBar from "@components/NavBar";
import FilterBar from "@components/quizView/FilterBar";
import QuizCard from "@components/quizView/QuizCard";
import React from "react";
import { trpc } from "../../utils/trpc";

function Quiz() {
  const getQuizzes = trpc.quiz.getUserQuizzes.useQuery();

  return (
    <>
      <NavBar />
      <div className="mx-auto flex w-3/5 flex-col gap-8 py-10">
        <FilterBar />
        <div
          className={`grid gap-6 text-gray-200 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3`}
        >
          {getQuizzes.data?.map((quiz) => (
            <QuizCard quiz={quiz} />
          ))}
        </div>
      </div>
    </>
  );
}

export default Quiz;
