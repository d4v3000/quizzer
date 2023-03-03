import { useTransition, animated, config } from "@react-spring/web";
import * as Dialog from "@radix-ui/react-dialog";
import { FC, ReactNode } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface IProps {
  children: ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Modal: FC<IProps> = ({ children, open, setOpen }) => {
  const transitions = useTransition(open, {
    from: { opacity: 0, scale: 0 },
    enter: { opacity: 1, scale: 1, y: "-50%", x: "-50%" },
    leave: { opacity: 0, scale: 0 },
    config: config.stiff,
  });

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {transitions((styles, item) =>
        item ? (
          <>
            <Dialog.Overlay
              forceMount
              asChild
              className="fixed inset-0 bg-black bg-opacity-50"
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
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md border-2 border-zinc-700 bg-zinc-800 px-16 py-8"
            >
              <animated.div style={styles}>
                <div className="flex flex-col items-center gap-3">
                  <Dialog.Close className="absolute top-0 right-0 p-2">
                    <XMarkIcon className="h-6 w-6 stroke-white" />
                  </Dialog.Close>
                  {children}
                </div>
              </animated.div>
            </Dialog.Content>
          </>
        ) : null
      )}
    </Dialog.Root>
  );
};

export default Modal;
