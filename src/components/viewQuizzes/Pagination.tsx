import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from "@heroicons/react/20/solid";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { usePagination } from "../../hooks/usePagination";

interface IProps {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}

const Pagination: FC<IProps> = ({
  itemsPerPage,
  totalItems,
  currentPage,
  setCurrentPage,
}) => {
  const pageinationRange = usePagination({
    currentPage: currentPage,
    pageSize: itemsPerPage,
    totalCount: totalItems,
  });

  return (
    <div className="flex justify-center pb-10">
      <nav className="w-full">
        <ul className="list-style-none flex w-full justify-between">
          <PaginationNavigator
            isPrev={true}
            active={currentPage > 1}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
          <div className="flex gap-2">
            {pageinationRange?.map((pageNumber) => {
              if (pageNumber === -1) {
                return (
                  <li>
                    <a
                      className="
                       relative block py-1.5 px-3 text-lg font-medium text-zinc-400"
                    >
                      . . .
                    </a>
                  </li>
                );
              }

              return (
                <PaginationItem
                  active={pageNumber === currentPage}
                  pageNumber={pageNumber}
                  setCurrentPage={setCurrentPage}
                />
              );
            })}
          </div>
          <PaginationNavigator
            isPrev={false}
            active={currentPage < Math.ceil(totalItems / itemsPerPage)}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </ul>
      </nav>
    </div>
  );
};

interface ItemProps {
  pageNumber: number;
  active: boolean;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}

const PaginationItem: FC<ItemProps> = ({
  pageNumber,
  active,
  setCurrentPage,
}) => {
  return (
    <li>
      <a
        onClick={() => setCurrentPage(pageNumber)}
        className={`${
          active
            ? "border-t-2 border-indigo-600 text-indigo-600"
            : "cursor-pointer rounded-md bg-transparent text-zinc-400 hover:bg-zinc-800"
        } relative block py-1.5 px-3 text-lg font-medium`}
      >
        {pageNumber}
      </a>
    </li>
  );
};

interface NavigatorProps {
  isPrev: boolean;
  active: boolean;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  currentPage: number;
}

const PaginationNavigator: FC<NavigatorProps> = ({
  isPrev,
  active,
  setCurrentPage,
  currentPage,
}) => {
  return (
    <li>
      <a
        onClick={() =>
          setCurrentPage(isPrev ? currentPage - 1 : currentPage + 1)
        }
        className={`inline-flex ${
          active
            ? "cursor-pointer text-zinc-400"
            : "pointer-events-none text-zinc-500"
        } items-center gap-4 rounded bg-transparent py-1.5 px-3 text-lg transition-all duration-300 hover:bg-zinc-800`}
      >
        {isPrev ? (
          <>
            <ArrowLongLeftIcon className="h-6 w-6" />
            Previous
          </>
        ) : (
          <>
            Next
            <ArrowLongRightIcon className="h-6 w-6" />
          </>
        )}
      </a>
    </li>
  );
};

export default Pagination;
