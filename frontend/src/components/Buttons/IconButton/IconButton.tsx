import type { ReactNode } from "react";
import classes from "./IconButton.module.scss";

interface IconButtonProps {
  children: ReactNode;
  color: "green" | "red";
  handleClick: () => void;
}

export default function IconButton({
  children,
  color,
  handleClick,
}: IconButtonProps) {
  const colorKey = `iconBtn--${color}`;

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${classes.iconBtn} ${classes[colorKey]}`}
    >
      {children}
    </button>
  );
}
