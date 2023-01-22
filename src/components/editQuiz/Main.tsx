import { FC } from "react";
import Settings from "./Settings";

const Main: FC = () => {
  return (
    <div className="flex w-2/4 flex-col items-center justify-between p-10">
      <Settings />
    </div>
  );
};

export default Main;
