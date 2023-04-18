import { ReactNode, forwardRef } from "react";

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

const NavItem = forwardRef<HTMLButtonElement, IProps>((props, forwardRef) => {
  const { children, ...otherProps } = props;
  return (
    <button
      className="flex cursor-pointer items-center gap-1 rounded-full border border-gray-400 bg-gray-600 py-1 px-3 hover:bg-zinc-700"
      {...otherProps}
      ref={forwardRef}
    >
      {children}
    </button>
  );
});
NavItem.displayName = "NavButton";

export default NavItem;
