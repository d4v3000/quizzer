import {
  EyeIcon,
  EyeSlashIcon,
  PaperClipIcon,
} from "@heroicons/react/24/outline";
import Background from "@ui/Background";
import Button from "@ui/Button";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";

const Lobby = () => {
  const baseUrl = "http://localhost:3000" || process.env.BASE_URL;
  const router = useRouter();
  const [showInviteLink, setShowInviteLink] = useState(false);

  const colors = ["red", "blue", "green", "purple", "fuchsia"];
  const players = ["Name1", "Name2", "Name3"];

  return (
    <div className="mx-auto grid h-screen w-10/12 grid-flow-col grid-rows-3 gap-6 py-8">
      <Background className="row-span-2">
        <div className="flex flex-col gap-8 p-2">
          <div>Players currently unassigned:</div>
          <div className="flex flex-col gap-2">
            <p>Number 1</p>
            <p>Number 2</p>
            <p>Number 3</p>
            <p>Number 4</p>
          </div>
        </div>
      </Background>
      <div className="col-span-5">
        <div className="flex h-full gap-4">
          {colors.map((color, i) => (
            <div
              key={`team_${i}`}
              className={`flex h-full w-full flex-col justify-between rounded-md border border-${color}-900 p-4`}
            >
              Team Name
              <div className="flex flex-wrap gap-2">
                {players.map((player, j) => (
                  <div
                    key={`${player}_${i}${j}`}
                    className="flex items-center rounded-full border border-zinc-600 py-1 px-3 text-sm"
                  >
                    {player}
                  </div>
                ))}
              </div>
              <Button intent="secondary" className="hover:bg-zinc-800">
                Join Team
              </Button>
            </div>
          ))}
        </div>
      </div>
      <Background className="col-span-2 row-span-2">
        <div className="flex h-full flex-col items-center justify-between p-4">
          <div className="flex w-full flex-col items-center gap-3">
            <h1 className="text-3xl font-extrabold">This awesome Quiz</h1>
            <h2 className="text-xl font-bold">
              presentend to you by: Quiz Master
            </h2>
            <h3>You can expect 34 Questions this evening</h3>
          </div>
          <div className="flex w-1/2 cursor-pointer items-center rounded-2xl border border-zinc-200">
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
      </Background>
      <Background className="col-span-2 row-span-2">
        <div className="flex flex-col p-2">Chat</div>
      </Background>
    </div>
  );
};

export default Lobby;
