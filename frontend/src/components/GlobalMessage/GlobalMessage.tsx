import type { ReactNode } from "react";
import classes from "./GlobalMessage.module.scss";

interface GlobalMessageProps {
  children: ReactNode;
  msg: string;
  type: "error" | "loading";
}

export default function GlobalMessage({
  children,
  msg,
  type,
}: GlobalMessageProps) {
  const msgType = "globalMsg-" + type;

  return (
    <section
      className={`section errorMsg ${classes.globalMsg} ${classes[msgType]}`}
    >
      <div className={classes.icon}>{children}</div>
      <div>{msg}</div>
    </section>
  );
}
