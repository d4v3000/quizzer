import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { FC, useEffect, useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IMessage } from "./Lobby";
import { socket } from "@utils/websocket/socket";
import { useRouter } from "next/router";
import * as ScrollArea from "@radix-ui/react-scroll-area";

interface IProps {
  messages?: IMessage[];
  userName?: string;
  roomId?: string;
}

interface IFormInputs {
  message: string;
}

const Chat: FC<IProps> = ({ messages, userName, roomId }) => {
  const router = useRouter();
  const sendMessage = (data: IFormInputs) => {
    const message = { message: data.message, sender: userName };
    if (roomId) {
      socket.emit("send-team-message", message, roomId);
    } else {
      socket.emit("send-global-message", message, router.query.id);
    }
    reset({ message: "" });
  };

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInputs>();
  const onSubmit: SubmitHandler<IFormInputs> = (data) => sendMessage(data);

  return (
    <div className="flex h-full flex-col justify-between gap-2">
      <ScrollArea.Root
        className="flex flex-col gap-2 overflow-hidden p-1"
        type="auto"
      >
        <ScrollArea.Viewport>
          {messages?.map((message, i) => (
            <>
              {message.sender === "system" ? (
                <p
                  key={`message_${i}`}
                  className="pt-1 text-center text-sm text-zinc-400"
                >
                  {message.message}
                </p>
              ) : (
                <p
                  key={`message_${i}`}
                  className="pt-1 text-base text-zinc-200"
                >
                  <span className="font-semibold">{message.sender}: </span>
                  {message.message}
                </p>
              )}
            </>
          ))}
          <div ref={scrollRef} />
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          orientation="vertical"
          className="my-2 flex rounded-md bg-zinc-600 p-0.5"
        >
          <ScrollArea.Thumb className="relative flex rounded-2xl border-2 border-zinc-900" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center gap-2">
          <input
            placeholder="Enter Message"
            maxLength={30}
            {...register("message", { required: true })}
            className="w-full rounded-md border border-transparent bg-zinc-700 p-3 text-base font-medium text-zinc-200 focus:outline-none"
            autoFocus
          />
          <button
            type="submit"
            className="flex h-full items-center gap-2 rounded-md border p-2 hover:bg-zinc-800"
          >
            Send <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
        {errors.message && (
          <div className="text-red-400">Message is required</div>
        )}
      </form>
    </div>
  );
};

export default Chat;
