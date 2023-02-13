export const LoadingCard = () => {
  return (
    <div className="flex animate-pulse flex-col gap-2 rounded-md border border-zinc-700 p-4">
      <div className="w-1/2 rounded-md bg-zinc-600 py-2 px-6"></div>
      <div className="w-1/5 rounded-md bg-zinc-600 py-1 px-4"></div>
      <div className="flex w-full p-2">
        <div className="flex w-full items-center gap-2">
          <div className="rounded-full bg-zinc-600 p-2"></div>
          <div className="rounded-md bg-zinc-600 py-2 px-8"></div>
        </div>
        <div className="flex w-full items-center justify-end gap-2">
          <div className="rounded-full bg-zinc-600 p-2"></div>
          <div className="rounded-md bg-zinc-600 py-2 px-8"></div>
        </div>
      </div>
      <div className="flex w-full justify-between gap-2">
        <div className="w-1/3 rounded-md bg-zinc-600 p-3"></div>
        <div className="w-1/3 rounded-md bg-zinc-600 p-3"></div>
        <div className="w-1/3 rounded-md bg-zinc-600 p-3"></div>
      </div>
    </div>
  );
};

export const LoadingSpinner = () => {
  return (
    <svg
      className="h-5 w-5 animate-spin text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};
