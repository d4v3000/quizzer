import { useMemo } from "react";

interface IProps {
  totalCount: number;
  pageSize: number;
  currentPage: number;
}

export const usePagination = ({
  totalCount,
  pageSize,
  currentPage,
}: IProps) => {
  const range = (start: number, end: number) => {
    let length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
  };

  const paginationRange = useMemo(() => {
    const totalPages = Math.ceil(totalCount / pageSize);
    const numOfSiblings = 2;
    const totalPageNumbers = 5 + numOfSiblings;

    if (totalPageNumbers >= totalPages) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - numOfSiblings, 1);
    const rightSiblingIndex = Math.min(currentPage + numOfSiblings, totalPages);

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 2;

    if (!showLeftDots && showRightDots) {
      const leftRange = range(1, 6);

      return [...leftRange, -1, totalPages];
    }

    if (showLeftDots && !showRightDots) {
      const rightRange = range(totalPages - 5, totalPages);

      return [1, -1, ...rightRange];
    }

    if (showLeftDots && showRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);

      return [1, -1, ...middleRange, -1, totalPages];
    }
  }, [totalCount, pageSize, currentPage]);

  return paginationRange;
};
