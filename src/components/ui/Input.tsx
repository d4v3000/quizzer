import { cva, type VariantProps } from "class-variance-authority";
import { FC, InputHTMLAttributes } from "react";

const input = cva("button", {
  variants: {
    intent: {
      primary: [
        "w-full p-3 border border-transparent text-base font-medium rounded-md text-zinc-200 bg-zinc-800 focus:outline-none",
      ],
      secondary: ["flex items-center border border-zinc-500 uppercase"],
    },
  },
  defaultVariants: {
    intent: "primary",
  },
});

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof input> {}

const Input: FC<InputProps> = ({ className, intent, ...props }) => (
  <input className={input({ intent, className })} {...props} />
);

export default Input;
