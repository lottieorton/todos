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
  const classNames = `${classes.btn} ${isRounded ? classes.rounded : ""} ${isSelected ? classes.selected : ""}`;

  return (
    <button type="submit" className={classNames} aria-label="Submit">
      {children}
    </button>
  );
}
