import NavBar from "@components/NavBar";
import FilterBar from "@components/quizView/FilterBar";
import QuizCard from "@components/quizView/QuizCard";
import { LoadingCard } from "@ui/Loader";
import React, { useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";

function Quiz() {
  const [orderBy, setOrderBy] = useState<
    "createdAt" | "updatedAt" | "questions" | "title" | "numberTeams"
  >("createdAt");
  const [orderDir, setOrderDir] = useState<"desc" | "asc">("desc");
  const [search, setSearch] = useState("");
  const [numOfCols, setNumOfCols] = useState<number[]>([3]);

  const getQuizzes = trpc.quiz.getUserQuizzes.useQuery({
    orderBy: orderBy,
    orderDir: orderDir,
    skip: 5,
    take: 9,
    search: search,
  });
  const loadingCards = [...Array(9).keys()];
  useEffect(() => {
    getQuizzes.refetch();
  }, []);

  return (
    <>
      <NavBar />
      <div className="mx-auto flex w-3/5 flex-col gap-8 py-10">
        <FilterBar
          orderBy={orderBy}
          setOrderBy={setOrderBy}
          orderDir={orderDir}
          setOrderDir={setOrderDir}
          setSearch={setSearch}
          numOfCols={numOfCols}
          setNumOfCols={setNumOfCols}
        />
        <div
          style={{
            gridTemplateColumns: `repeat(${numOfCols[0]! + 1}, minmax(0, 1fr))`,
          }}
          className={`grid gap-6 text-gray-200`}
        >
          {getQuizzes.isLoading || getQuizzes.isFetching
            ? loadingCards.map((card) => <LoadingCard key={card} />)
            : getQuizzes.data?.map((quiz) => <QuizCard quiz={quiz} />)}
        </div>
      </div>
    </>
  );
}

export default Quiz;
