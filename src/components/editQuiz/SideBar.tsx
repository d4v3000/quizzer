import {
  ArrowPathRoundedSquareIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { isUndefined } from "lodash";
import { FC } from "react";

interface IProps {
  numTeams: number | undefined;
}

const SideBar: FC<IProps> = ({ numTeams }) => {
  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full p-2">
        <div className="flex w-full items-center gap-2">
          <UserGroupIcon className="h-6 w-6" />
          <p>{isUndefined(numTeams) ? 1 : numTeams} Teams</p>
        </div>
        <div className="flex w-full items-center justify-end gap-2">
          <ArrowPathRoundedSquareIcon className="h-6 w-6" />
          <p>2 Rounds</p>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
