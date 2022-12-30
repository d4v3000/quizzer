import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const button = cva("button", {
  variants: {
    intent: {
      primary: [
        "from-indigo-600 to-violet-700",
        "flex",
        "items-center",
        "bg-gradient-to-r",
        "text-white",
        "rounded-md",
      ],
      secondary: ["flex items-center border border-zinc-500 uppercase"],
    },
    size: {
      small: ["text-sm", "py-1.5", "px-3", "mr-4", "my-3"],
      medium: ["text-base", "py-2", "px-4"],
      large: [
        "px-8",
        "py-2",
        "rounded-3xl",
        "uppercase font-bold hover:scale-[1.03] gap-3",
      ],
    },
  },
  defaultVariants: {
    intent: "primary",
    size: "medium",
  },
});

export interface ButtonProps
  extends React.HTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {}

export const Button: React.FC<ButtonProps> = ({
  className,
  intent,
  size,
  children,
  ...props
}) => (
  <button className={button({ intent, size, className, ...props })}>
    {children}
  </button>
);
