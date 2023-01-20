import {
  ArrowPathRoundedSquareIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import Button from "@ui/Button";
import { isUndefined } from "lodash";
import { FC, useState } from "react";

import SelectionModal from "./SelectionModal";

interface IProps {
  numTeams: number | undefined;
}

const SideBar: FC<IProps> = ({ numTeams }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-full w-full flex-col justify-between">
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
      <div className="flex flex-col items-center gap-2">
        <hr className="border-1 w-full border-zinc-400" />
        <Button intent="secondary" size="small" onClick={() => setOpen(true)}>
          Add Round
        </Button>
        <SelectionModal open={open} setOpen={setOpen} />
      </div>
    </div>
  );
};

export default SideBar;
