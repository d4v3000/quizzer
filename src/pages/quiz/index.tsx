import NavBar from "@components/NavBar";
import FilterBar from "@components/viewQuizzes/FilterBar";
import Pagination from "@components/viewQuizzes/Pagination";
import QuizCard from "@components/viewQuizzes/QuizCard";
import { LoadingCard } from "@ui/Loader";
import { parseInt } from "lodash";
import React, { useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";
import { GetServerSidePropsContext } from "next";
import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

function Quiz() {
  const [orderBy, setOrderBy] = useState<
    "createdAt" | "updatedAt" | "questions" | "title" | "numberTeams"
  >("createdAt");
  const [orderDir, setOrderDir] = useState<"desc" | "asc">("desc");
  const [search, setSearch] = useState("");
  const [numOfCols, setNumOfCols] = useState<number[]>([3]);
  const [itemsPerPage, setItemsPerPage] = useState("9");
  const [currentPage, setCurrentPage] = useState(1);

  const getQuizzes = trpc.quiz.getUserQuizzes.useQuery({
    orderBy: orderBy,
    orderDir: orderDir,
    skip: parseInt(itemsPerPage) * (currentPage - 1),
    take: parseInt(itemsPerPage),
    search: search,
  });
  const totalNumOfQuizzes = trpc.quiz.getNumberOfQuizzes.useQuery();
  const loadingCards = [...Array(9).keys()];
  useEffect(() => {
    getQuizzes.refetch();
    totalNumOfQuizzes.refetch();
  }, []);

  return (
    <>
      <NavBar />
      <div className="mx-auto flex h-[calc(100vh-57px)] w-3/5 flex-col justify-between gap-4 pt-10">
        <div className="flex flex-col gap-8">
          <FilterBar
            orderBy={orderBy}
            setOrderBy={setOrderBy}
            orderDir={orderDir}
            setOrderDir={setOrderDir}
            setSearch={setSearch}
            numOfCols={numOfCols}
            setNumOfCols={setNumOfCols}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
          />
          <div
            style={{
              gridTemplateColumns: `repeat(${numOfCols[0]!}, minmax(0, 1fr))`,
            }}
            className={`grid gap-6 text-gray-200`}
          >
            {getQuizzes.isLoading || getQuizzes.isFetching
              ? loadingCards.map((card) => <LoadingCard key={card} />)
              : getQuizzes.data?.map((quiz, i) => (
                  <QuizCard key={`quiz_${i}`} quiz={quiz} />
                ))}
          </div>
        </div>
        {totalNumOfQuizzes.data && (
          <Pagination
            itemsPerPage={parseInt(itemsPerPage)}
            totalItems={totalNumOfQuizzes.data}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>
    </>
  );
}

export default Quiz;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return { redirect: { destination: "/" } };
  } else {
    return {
      props: {},
    };
  }
}
