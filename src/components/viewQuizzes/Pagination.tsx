import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from "@heroicons/react/20/solid";
import { Dispatch, FC, SetStateAction } from "react";
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
    <div className="flex w-full justify-center pb-2">
      <nav className="w-full">
        <ul className="list-style-none flex w-full justify-between">
          <PaginationNavigator
            isPrev={true}
            active={currentPage > 1}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
          <div className="flex gap-2">
            {pageinationRange?.map((pageNumber, i) => {
              if (pageNumber === -1) {
                return (
                  <li key={`pagination_${i}`}>
                    <a
                      className="
                       relative block px-3 py-1.5 text-lg font-medium text-zinc-400"
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
                  key={`pagination_${i}`}
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
            ? "border-t-[1px] border-indigo-600 text-indigo-600 sm:border-t-2"
            : "cursor-pointer rounded-md bg-transparent text-zinc-400 hover:bg-zinc-800"
        } relative block px-1.5 py-0.5 text-lg font-medium sm:px-3 sm:py-1.5`}
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
        } items-center gap-4 rounded bg-transparent px-1 py-0.5 text-lg transition-all duration-300 hover:bg-zinc-800 sm:px-3 sm:py-1.5`}
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
