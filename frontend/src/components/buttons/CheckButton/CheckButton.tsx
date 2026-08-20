import classes from "./CheckButton.module.scss";

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
      aria-label={`Mark as ${isComplete ? "incomplete" : "complete"}`}
    >
      <i className="fa-solid fa-check"></i>
    </button>
  );
}
