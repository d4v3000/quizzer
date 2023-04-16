import React, { ReactNode } from "react";

interface IProps {
  children: ReactNode;
}

const NavButton = React.forwardRef<HTMLButtonElement, IProps>(
  (props, forwardRef) => {
    return (
      <button
        className="flex cursor-pointer items-center gap-1 rounded-full border border-gray-400 bg-gray-600 py-1 px-3 hover:bg-zinc-700"
        {...props}
        ref={forwardRef}
      >
        {props.children}
      </button>
    );
  }
);
NavButton.displayName = "NavButton";

export default NavButton;
