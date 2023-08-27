import { FC, useState } from "react";
import { socket } from "@utils/websocket/socket";
import Button from "@ui/Button";
import {
  EyeIcon,
  EyeSlashIcon,
  PaperClipIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

interface IProps {
  quizName?: string;
  quizMaster?: { id: string; name: string };
  numOfQuestions?: string;
  isQuizMaster: boolean;
}

const InformationCard: FC<IProps> = ({
  quizName,
  quizMaster,
  numOfQuestions,
  isQuizMaster,
}) => {
  const router = useRouter();
  const baseUrl = "http://localhost:3000" || process.env.BASE_URL;
  const [showInviteLink, setShowInviteLink] = useState(false);

  return (
    <div className="flex h-full flex-col items-center justify-between p-4">
      <div className="flex w-full flex-col items-center gap-3">
        <h1 className="text-3xl font-extrabold">{quizName}</h1>
        <h2 className="text-xl font-bold">
          presentend to you by: {quizMaster?.name}
          {quizMaster?.id === socket.id ? " (You)" : ""}
        </h2>
        <h3>You can expect {numOfQuestions} Questions this evening</h3>
      </div>
      {isQuizMaster && (
        <Button
          onClick={() => socket.emit("start-game", router.query.id, {})}
          size="large"
        >
          Start Game
        </Button>
      )}
      <div className="flex w-full cursor-pointer items-center rounded-2xl border border-zinc-200 lg:w-1/2">
        <div
          className={`${
            showInviteLink ? "cursor-text" : "cursor-pointer"
          } flex h-full w-full items-center justify-center gap-2 rounded-2xl rounded-r-none border-0 border-r-2 p-2`}
          onClick={() => {
            if (!showInviteLink) {
              navigator.clipboard.writeText(baseUrl + router.asPath);
              toast.success("Copied to clipboard!");
            }
          }}
        >
          {showInviteLink ? (
            <>{router.query.id}</>
          ) : (
            <>
              Copy Invitation Link <PaperClipIcon className="h-5 w-5" />
            </>
          )}
        </div>
        <div
          className="flex items-center justify-center rounded-2xl rounded-l-none p-2"
          onClick={() => setShowInviteLink(!showInviteLink)}
        >
          {showInviteLink ? (
            <EyeSlashIcon className="h-6 w-6" />
          ) : (
            <EyeIcon className="h-6 w-6" />
          )}
        </div>
      </div>
    </div>
  );
};

export default InformationCard;
