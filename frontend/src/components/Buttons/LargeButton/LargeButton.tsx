import type { ReactNode } from "react";
import classes from "./LargeButton.module.scss";

interface LargeButtonProps {
  children: ReactNode;
  isSelected?: boolean;
}

export default function LargeButton({
  children,
  isSelected = false,
}: LargeButtonProps) {
  return (
    <button
      type="submit"
      className={`${classes.btn} ${isSelected && classes.selected}`}
      aria-label="filter"
    >
      {children}
    </button>
  );
}
