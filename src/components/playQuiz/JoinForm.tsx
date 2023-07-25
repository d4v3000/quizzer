import Button from "@ui/Button";
import Label from "@ui/Label";
import { socket } from "@utils/websocket/socket";
import { useGameStore } from "@utils/zustand/gameStore";
import { useRouter } from "next/router";
import { Dispatch, FC, SetStateAction } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface IFormInputs {
  userName: string;
}

const JoinForm = () => {
  const router = useRouter();
  const setUser = useGameStore((state) => state.setUser);

  const joinLobby = (data: IFormInputs) => {
    socket.emit("join-lobby", {
      userName: data.userName,
      lobbyId: router.query.id,
    });
    setUser({ id: socket.id, name: data.userName, team: null });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputs>();
  const onSubmit: SubmitHandler<IFormInputs> = (data) => joinLobby(data);

  return (
    <div className="mx-auto flex h-screen w-1/4 flex-col justify-center gap-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto flex h-screen w-full flex-col justify-center gap-4"
      >
        <Label text="Username" />
        <input
          placeholder="Enter Username"
          maxLength={30}
          {...register("userName", { required: true })}
          className="w-full rounded-md border border-transparent bg-zinc-700 p-3 text-base font-medium text-zinc-200 focus:outline-none"
          autoFocus
        />
        {errors.userName && (
          <div className="text-red-400">Username is required</div>
        )}
        <Button type="submit">Join Lobby</Button>
      </form>
    </div>
  );
};

export default JoinForm;
