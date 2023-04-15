import { XMarkIcon } from "@heroicons/react/24/outline";
import { FC } from "react";
import { socket } from "@utils/websocket/socket";
import { useRouter } from "next/router";

interface IProps {
  name: string;
  id: string;
  isQuizMaster: boolean;
  className?: string;
}

const PlayerBadge: FC<IProps> = ({ name, id, isQuizMaster, className }) => {
  const router = useRouter();
  const kickPlayer = () => {
    socket.emit("kick-player", id, router.query.id);
  };

  return (
    <div
      className={`flex w-fit items-center gap-2 rounded-full border border-white py-1 px-3 text-sm ${className}`}
    >
      {name} {socket.id === id ? "(You)" : ""}{" "}
      {isQuizMaster && (
        <XMarkIcon
          className="h-5 w-5 cursor-pointer stroke-red-700 stroke-2"
          onClick={() => kickPlayer()}
        />
      )}
    </div>
  );
};

export default PlayerBadge;
