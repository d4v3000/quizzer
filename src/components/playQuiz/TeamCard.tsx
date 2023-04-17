import { CheckIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { Dispatch, FC, SetStateAction, useState } from "react";
import PlayerBadge from "./PlayerBadge";
import Button from "@ui/Button";
import { IMessage, IPlayer } from "./Lobby";
import { socket } from "@utils/websocket/socket";
import { useRouter } from "next/router";

interface IProps {
  color: string;
  index: string;
  isQuizMaster: boolean;
  players: IPlayer[];
  user: {
    id?: string;
    name?: string;
    team: string | null;
  };
  name: string;
  setUser: Dispatch<
    SetStateAction<
      | {
          id?: string | undefined;
          name?: string | undefined;
          team: string | null;
        }
      | undefined
    >
  >;
  setTeamMessages: Dispatch<SetStateAction<IMessage[]>>;
}

const TeamCard: FC<IProps> = ({
  color,
  index,
  isQuizMaster,
  players,
  user,
  name,
  setUser,
  setTeamMessages,
}) => {
  const router = useRouter();
  const [teamName, setTeamName] = useState(name);
  const [isEdit, setIsEdit] = useState(false);

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
    setUser(
      (
        user: { id?: string; name?: string; team: string | null } | undefined
      ) => ({
        ...user,
        team: teamId,
      })
    );
    setTeamMessages([]);
  };

  return (
    <div
      className={`flex h-full w-full flex-col justify-between rounded-md border p-4`}
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
