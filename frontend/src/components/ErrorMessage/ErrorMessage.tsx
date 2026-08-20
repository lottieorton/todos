import classes from "./ErrorMessage.module.scss";

interface ErrorMessageProps {
  msg: string | null;
}

export default function ErrorMessage({ msg }: ErrorMessageProps) {
  let printMsg: string;
  switch (msg) {
    case "Must select a category":
    case "Must enter a name":
    case "Maximum category limit reached":
      printMsg = msg;
      break;
    case "Bad Request":
      printMsg =
        "Invalid values. Ensure name is not empty and a category is selected.";
      break;
    default:
      printMsg = "Oops, something went wrong. Please try reloading the page.";
  }

  return (
    <p className={classes.errorMsg} data-testid="errorMsg">
      {printMsg}
    </p>
  );
}
