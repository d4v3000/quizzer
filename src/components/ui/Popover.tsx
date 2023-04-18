import * as PopoverPrimitive from "@radix-ui/react-popover";
import { FC, ReactNode } from "react";

interface IProps {
  children: ReactNode;
  triggerNode: ReactNode;
  sideOffset?: number;
  align?: "center" | "start" | "end";
  className?: string;
}

const Popover: FC<IProps> = ({
  children,
  triggerNode,
  sideOffset,
  align,
  className,
}) => {
  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>{triggerNode}</PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          sideOffset={sideOffset}
          align={align}
          className={`rounded-md border border-zinc-400 bg-zinc-700 p-5 data-[state=open]:animate-slideDownAndFade  ${className}`}
        >
          {children}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
};

export default Popover;
