import classes from "./Checkbutton.module.scss";

interface CheckButtonProps {
  isComplete: boolean;
  toggleComplete: () => void;
}

export default function CheckButton({
  isComplete,
  toggleComplete,
}: CheckButtonProps) {
  return (
    <button
      onClick={toggleComplete}
      className={`${classes.btn} ${isComplete && classes.btn__checked}`}
      aria-label="Check"
    >
      <i className="fa-solid fa-check"></i>
    </button>
  );
}
