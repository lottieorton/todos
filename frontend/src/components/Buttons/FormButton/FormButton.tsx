import type { ReactNode } from "react";
import classes from "./FormButton.module.scss";

interface ButtonProps {
  children: ReactNode;
  isRounded?: boolean;
}

export default function FormButton({
  children,
  isRounded = false,
}: ButtonProps) {
  return (
    <button
      type="submit"
      className={`${classes.btn} ${isRounded && classes.rounded}`}
      aria-label="Submit"
    >
      {children}
    </button>
  );
}
