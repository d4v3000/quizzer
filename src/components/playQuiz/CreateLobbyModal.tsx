import Button from "@ui/Button";
import Input from "@ui/Input";
import Label from "@ui/Label";
import { LoadingSpinner } from "@ui/Loader";
import Modal from "@ui/Modal";
import { socket } from "@utils/websocket/socket";
import { useGameStore } from "@utils/zustand/gameStore";
import { useRouter } from "next/router";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import AllQuizzesSelect from "./AllQuizzesSelect";
import { useQuizStore } from "@utils/zustand/quizStore";

interface IFormInputs {
  quiz: string;
  userName: string;
  numOfTeams: number;
}

interface IProps {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  quizId?: string;
  numOfQuestions?: string;
  quizTitle?: string;
}

const CreateLobbyModal: FC<IProps> = ({
  isModalOpen,
  setIsModalOpen,
  quizId,
  numOfQuestions,
  quizTitle,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const setSocketId = useGameStore((state) => state.setSocketId);
  const setUserName = useGameStore((state) => state.setUserName);
  const setQuizName = useGameStore((state) => state.setQuizName);
  const setNumOfQuestions = useGameStore((state) => state.setNumOfQuestions);
  const setNumOfTeams = useGameStore((state) => state.setNumOfTeams);
  const setUser = useGameStore((state) => state.setUser);

  const createLobby = (data: IFormInputs) => {
    const quiz = JSON.parse(data.quiz);
    setIsLoading(true);
    setUserName(data.userName);
    setSocketId(socket.id);
    setQuizName(quiz!.title);
    setNumOfQuestions(quiz!.numOfQuestions);
    setNumOfTeams(data.numOfTeams);
    setUser({
      team: null,
      id: socket.id,
      name: data.userName,
    });
    socket.emit(
      "create-lobby",
      {
        quizId: quiz!.id,
        userName: data.userName,
        numOfTeams: data.numOfTeams,
        quizName: quiz!.title,
        numOfQuestions: quiz!.numOfQuestions,
      },
      (response: { id: string }) => {
        setIsLoading(false);
        router.push(`/play/${response.id}`);
      }
    );
  };

  useEffect(() => {
    if (quizId && numOfQuestions && quizTitle) {
      setValue(
        "quiz",
        `{"id": "${quizId}","title": "${quizTitle}","numOfQuestions": "${numOfQuestions}"}`
      );
    }
  }, [quizId, numOfQuestions, quizTitle]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<IFormInputs>();
  const onSubmit: SubmitHandler<IFormInputs> = (data) => createLobby(data);

  return (
    <Modal open={isModalOpen} setOpen={setIsModalOpen}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex w-48 flex-col gap-6 lg:w-80">
          <div className="flex flex-col gap-2">
            <Label text="Username" />
            <Input
              placeholder="Enter Username"
              maxLength={30}
              {...register("userName", { required: true })}
              intent="secondary"
              autoFocus
            />
            {errors.userName && (
              <div className="text-red-400">Username is required</div>
            )}
          </div>
          {!quizId && <AllQuizzesSelect {...register("quiz")} />}
          <div className="flex flex-col gap-2">
            <Label text="Number of teams" />
            <select
              className="w-full rounded-md border border-transparent bg-zinc-700 p-3 text-base text-zinc-200 focus:outline-none"
              {...register("numOfTeams", { required: true })}
            >
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </select>
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <LoadingSpinner /> : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateLobbyModal;
