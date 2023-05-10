import { cva, type VariantProps } from "class-variance-authority";

const button = cva("button", {
  variants: {
    intent: {
      primary: [
        "from-indigo-600 to-violet-700 bg-gradient-to-r",
        "flex items-center justify-center",
        "text-white",
        "rounded-md",
      ],
      secondary: [
        "flex items-center justify-center text-white border border-zinc-500 uppercase",
      ],
      danger: ["flex items-center justify-center bg-red-500 uppercase"],
    },
    size: {
      small: ["text-sm py-1.5 px-3 rounded-3xl font-bold hover:scale-[1.03]"],
      medium: ["text-base py-2 px-4 rounded-md font-bold"],
      large: [
        "md:px-8 md:py-2 px-4 py-1",
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
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {}

const Button: React.FC<ButtonProps> = ({
  className,
  intent,
  size,
  children,
  ...props
}) => (
  <button className={button({ intent, size, className })} {...props}>
    {children}
  </button>
);

export default Button;
