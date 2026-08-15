import classes from "./Checkbutton.module.scss";

export default function CheckButton() {
  return (
    <button
      className={classes.btn + " " + classes.btn__checked}
      aria-label="Check"
    >
      <i className="fa-solid fa-check"></i>
    </button>
  );
}
