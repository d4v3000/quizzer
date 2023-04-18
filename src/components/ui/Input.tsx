import { cva, type VariantProps } from "class-variance-authority";
import { FC, forwardRef, InputHTMLAttributes } from "react";

const input = cva("button", {
  variants: {
    intent: {
      primary: [
        "w-full p-3 border border-transparent text-base font-medium rounded-md text-zinc-200 bg-zinc-800 focus:outline-none",
      ],
      secondary: [
        "w-full p-3 border border-transparent text-base font-medium rounded-md text-zinc-200 bg-zinc-700 focus:outline-none",
      ],
    },
  },
  defaultVariants: {
    intent: "primary",
  },
});

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof input> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, intent, ...props }, ref) => {
    return (
      <input ref={ref} className={input({ intent, className })} {...props} />
    );
  }
);
Input.displayName = "CustomInput";

export default Input;
