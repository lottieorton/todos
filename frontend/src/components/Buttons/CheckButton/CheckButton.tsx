import classes from "./Checkbutton.module.scss";

export default function CheckButton() {
  return (
    <button className={classes.btn + " " + classes.btn__checked}>
      <i className="fa-solid fa-check"></i>
    </button>
  );
}
