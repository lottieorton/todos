import type { ReactNode } from "react";
import classes from "./AddButton.module.scss";

interface ButtonProps {
  children: ReactNode;
}

export default function AddButton({ children }: ButtonProps) {
  return (
    <button type="submit" className={classes.btn}>
      {children}
    </button>
  );
}
