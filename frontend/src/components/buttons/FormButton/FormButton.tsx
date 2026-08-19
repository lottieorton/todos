import type { ReactNode } from "react";
import classes from "./FormButton.module.scss";

interface ButtonProps {
  children: ReactNode;
  isRounded?: boolean;
  isSelected?: boolean;
}

export default function FormButton({
  children,
  isRounded = false,
  isSelected = false,
}: ButtonProps) {
  return (
    <button
      type="submit"
      className={`${classes.btn} ${isRounded && classes.rounded} ${isSelected && classes.selected}`}
      aria-label="Submit"
    >
      {children}
    </button>
  );
}
