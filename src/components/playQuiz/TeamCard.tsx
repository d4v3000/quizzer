import { CheckIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { FC, useState } from "react";
import PlayerBadge from "./PlayerBadge";
import Button from "@ui/Button";
import { IPlayer } from "./Lobby";
import { socket } from "@utils/websocket/socket";
import { useRouter } from "next/router";
import { useGameStore } from "@utils/zustand/gameStore";

interface IProps {
  color: string;
  index: string;
  isQuizMaster: boolean;
  players: IPlayer[];
  name: string;
}

const TeamCard: FC<IProps> = ({
  color,
  index,
  isQuizMaster,
  players,
  name,
}) => {
  const router = useRouter();
  const [teamName, setTeamName] = useState(name);
  const [isEdit, setIsEdit] = useState(false);

  const user = useGameStore((state) => state.user);
  const resetTeamMessages = useGameStore((state) => state.resetTeamMessages);
  const setUser = useGameStore((state) => state.setUser);

  const editTeamName = (teamId: string) => {
    socket.emit("edit-team-name", {
      lobbyId: router.query.id,
      teamId: teamId,
      name: teamName,
    });
  };

  const joinTeam = (teamId: string) => {
    socket.emit("join-team", {
      userName: user?.name,
      lobbyId: router.query.id,
      teamId: teamId,
      oldTeam: user?.team,
    });
    setUser({ team: teamId, name: user.name, id: user.id });
    resetTeamMessages();
  };

  return (
    <div
      className={`flex h-44 w-full flex-col justify-between rounded-md border p-4 md:h-full`}
      style={{ borderColor: color }}
    >
      <div className="flex items-center gap-2">
        {isEdit ? (
          <input
            value={teamName}
            className="bg-transparent focus:outline-none"
            autoFocus
            onChange={(e) => setTeamName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setIsEdit(false);
                editTeamName(index);
              }
            }}
          />
        ) : (
          <div>{teamName}</div>
        )}
        {isQuizMaster && !isEdit && (
          <PencilSquareIcon
            className="h-5 w-5 cursor-pointer"
            onClick={() => {
              setIsEdit(true);
              setTeamName(teamName);
            }}
          />
        )}
        {isQuizMaster && isEdit && (
          <CheckIcon
            className="h-5 w-5 cursor-pointer"
            onClick={() => {
              setIsEdit(false);
              editTeamName(index);
            }}
          />
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {players.map((player) => (
          <PlayerBadge
            name={player.name}
            id={player.id}
            isQuizMaster={isQuizMaster}
            key={`${player.name}_${player.id}`}
          />
        ))}
      </div>
      {index !== user.team && !isQuizMaster && (
        <Button
          intent="secondary"
          className="hover:bg-zinc-800"
          onClick={() => joinTeam(index)}
        >
          Join Team
        </Button>
      )}
    </div>
  );
};

export default TeamCard;
