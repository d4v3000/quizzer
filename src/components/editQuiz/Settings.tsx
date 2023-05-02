import Button from "@ui/Button";
import Input from "@ui/Input";
import Label from "@ui/Label";
import { useQuizStore } from "@utils/zustand/quizStore";
import { toNumber } from "lodash";
import { useState } from "react";
import DeleteQuizModal from "./DeleteQuizModal";
import { useRouter } from "next/router";

const Settings = () => {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const quizName = useQuizStore((state) => state.name);
  const setQuizName = useQuizStore((state) => state.setName);

  return (
    <>
      <div className="flex w-full flex-col">
        <Label text="Quiz Name" />
        <Input
          placeholder="Name of the quiz"
          onChange={(e) => setQuizName(e.target.value)}
          value={quizName}
        />
      </div>
      <div className="flex w-full flex-col items-center">
        <Label text="Delete Quiz" />
        <Button
          size="large"
          intent="danger"
          className="w-1/4"
          onClick={() => setIsDeleteModalOpen(true)}
        >
          Delete
        </Button>
        <DeleteQuizModal
          open={isDeleteModalOpen}
          setOpen={setIsDeleteModalOpen}
          id={router.query.id as string}
        />
      </div>
    </>
  );
};

export default Settings;
