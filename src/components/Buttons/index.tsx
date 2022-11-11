import { NextPage } from "next";
import { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  onClickFunction?: () => void;
};

const Button: NextPage<ButtonProps> = ({ children, onClickFunction }) => {
  return (
    <>
      <button
        onClick={onClickFunction}
        type="button"
        className="mr-2 mb-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2.5 hover:bg-gradient-to-l focus:outline-none focus:ring-4 focus:ring-purple-200 dark:focus:ring-purple-800"
      >
        {children}
      </button>
    </>
  );
};

export default Button;
