import type { ReactNode } from "react";
import classes from "./LargeButton.module.scss";

interface LargeButtonProps {
  children: ReactNode;
  isSelected?: boolean;
  handleClick: () => void;
}

export default function LargeButton({
  children,
  isSelected = false,
  handleClick,
}: LargeButtonProps) {
  return (
    <button
      className={`${classes.btn} ${isSelected && classes.selected}`}
      aria-label="filter"
      onClick={handleClick}
    >
      {children}
    </button>
  );
}
