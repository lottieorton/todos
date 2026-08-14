import TodoBar from "../TodoBar/TodoBar";
import classes from "./Header.module.scss";

export default function Header() {
  return (
    <section className={classes.header + " header"}>
      <h1 className={classes.heading + " " + classes.heading__large}>
        My Tasks List
      </h1>
      <h3 className={classes.heading + " " + classes.heading__small}>
        Make your life beautifully organised
      </h3>
      <TodoBar />
    </section>
  );
}
