import Button from "@ui/Button";
import Popover from "@ui/Popover";
import RulesModal from "./RulesModal";
import NavItem from "./NavItem";
import { FaceSmileIcon } from "@heroicons/react/24/outline";
import PlayerBadge from "./PlayerBadge";
import { UserIcon } from "@heroicons/react/24/solid";
import { IPlayer } from "./Lobby";
import { FC, useEffect, useState } from "react";
import { socket } from "@utils/websocket/socket";
import { useRouter } from "next/router";
import { useGameStore } from "@utils/zustand/gameStore";

interface IProps {
  players?: IPlayer[];
  isQuizMaster: boolean;
  userName?: string;
}

const NavBar: FC<IProps> = ({ players, isQuizMaster, userName }) => {
  const router = useRouter();
  const [rulesModalOpen, setRulesModalOpen] = useState(false);

  const reset = useGameStore((state) => state.reset);

  const leaveLobby = () => {
    socket.emit("leave-lobby", router.query.id);
    reset();
    router.push("/");
  };

  const randomizeTeams = () => {
    socket.emit("randomize-teams", router.query.id);
  };

  const resetTeams = () => {
    socket.emit("reset-teams", router.query.id);
  };

  return (
    <div className="flex w-full justify-between">
      <div className="flex items-center gap-2">
        <Popover
          sideOffset={5}
          align="start"
          triggerNode={
            <NavItem>
              Players <UserIcon className="h-5 w-5" /> {players?.length}
            </NavItem>
          }
        >
          <div className="flex w-full flex-col gap-2">
            <p className="text-xl font-semibold text-white">
              Players in this room:
            </p>
            <div className="flex flex-wrap gap-2">
              {players?.map((player) => (
                <PlayerBadge
                  name={player.name}
                  id={player.id}
                  isQuizMaster={isQuizMaster}
                  key={`playerList_${player.id}`}
                  className="bg-gray-600 text-white"
                />
              ))}
            </div>
            {isQuizMaster && (
              <>
                <Button
                  intent="secondary"
                  size="large"
                  className="bg-gray-600"
                  onClick={() => randomizeTeams()}
                >
                  Randomize Teams
                </Button>
                <Button
                  intent="secondary"
                  size="large"
                  className="bg-gray-600"
                  onClick={() => resetTeams()}
                >
                  Reset Teams
                </Button>
              </>
            )}
          </div>
        </Popover>
      </div>
      <div className="flex items-center gap-2">
        <NavItem onClick={() => setRulesModalOpen(true)}>Rules</NavItem>
        <RulesModal open={rulesModalOpen} setOpen={setRulesModalOpen} />
        <Popover
          triggerNode={
            <NavItem>
              {userName} <FaceSmileIcon className="h-5 w-5" />
            </NavItem>
          }
          sideOffset={5}
          align="end"
        >
          <div className="flex w-full flex-col gap-2">
            <Button
              intent="secondary"
              size="large"
              className="bg-gray-600"
              onClick={() => leaveLobby()}
            >
              Leave the Lobby
            </Button>
          </div>
        </Popover>
      </div>
    </div>
  );
};

export default NavBar;
