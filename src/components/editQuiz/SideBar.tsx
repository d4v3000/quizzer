import {
  ArrowPathRoundedSquareIcon,
  ChatBubbleLeftRightIcon,
  MapPinIcon,
  QuestionMarkCircleIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import Button from "@ui/Button";
import { isUndefined } from "lodash";
import { FC, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { XMarkIcon } from "@heroicons/react/24/solid";
import TypeBox from "./TypeBox";
import { useTransition, animated, config } from "@react-spring/web";
import IconTypes from "./IconTypes";

interface IProps {
  numTeams: number | undefined;
}

const SideBar: FC<IProps> = ({ numTeams }) => {
  const [open, setOpen] = useState(false);
  const transitions = useTransition(open, {
    from: { opacity: 0, scale: 0 },
    enter: { opacity: 1, scale: 1, y: "-50%", x: "-50%" },
    leave: { opacity: 0, scale: 0 },
    config: config.stiff,
  });

  const options = [
    {
      type: "question",
      name: "Question",
    },
    {
      type: "location",
      name: "Location",
    },
    {
      type: "guessing",
      name: "Guessing",
    },
  ];
  return (
    <div className="flex h-full w-full flex-col justify-between">
      <div className="flex w-full p-2">
        <div className="flex w-full items-center gap-2">
          <UserGroupIcon className="h-6 w-6" />
          <p>{isUndefined(numTeams) ? 1 : numTeams} Teams</p>
        </div>
        <div className="flex w-full items-center justify-end gap-2">
          <ArrowPathRoundedSquareIcon className="h-6 w-6" />
          <p>2 Rounds</p>
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <hr className="border-1 w-full border-zinc-400" />
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <Button intent="secondary" size="small">
              Add Round
            </Button>
          </Dialog.Trigger>
          {transitions((styles, item) =>
            item ? (
              <>
                <Dialog.Overlay
                  forceMount
                  asChild
                  className="fixed inset-0 bg-black bg-opacity-40"
                >
                  <animated.div
                    style={{
                      opacity: styles.opacity,
                    }}
                  />
                </Dialog.Overlay>
                <Dialog.Content
                  forceMount
                  asChild
                  className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-zinc-700 px-16 py-8"
                >
                  <animated.div style={styles}>
                    <div className="flex flex-col items-center gap-3">
                      <Dialog.Close className="absolute top-0 right-0 p-2">
                        <XMarkIcon className="h-6 w-6" />
                      </Dialog.Close>
                      <p className="text-lg font-semibold uppercase">
                        Choose Round Type
                      </p>
                      <div className="flex gap-4">
                        {options.map((option) => (
                          <TypeBox key={option.type}>
                            <IconTypes type={option.type} />
                            <p className="text-lg font-bold">{option.name}</p>
                          </TypeBox>
                        ))}
                      </div>
                    </div>
                  </animated.div>
                </Dialog.Content>
              </>
            ) : null
          )}
        </Dialog.Root>
      </div>
    </div>
  );
};

export default SideBar;
