import TodoBar from "../TodoBar/TodoBar";
import classes from "./SidebarHeader.module.scss";

export default function SidebarHeader() {
  return (
    <section className={classes.sidebarHeader + " sidebarHeader"}>
      <div className={classes.header}>
        <i className={classes.icon + " fa-solid fa-list-check"}></i>
        <h2 className={classes.heading}>Task By Task</h2>
      </div>
      <TodoBar />
    </section>
  );
}
