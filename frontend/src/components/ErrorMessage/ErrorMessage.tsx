import classes from "./ErrorMessage.module.scss";

interface ErrorMessageProps {
  msg: string | null;
  dataType: "task" | "category";
}

export default function ErrorMessage({ msg, dataType }: ErrorMessageProps) {
  let printMsg: string;
  switch (msg) {
    case "Bad Request":
      printMsg = `Invalid value${dataType === "task" ? "s" : ""}. Ensure name is not empty ${dataType === "task" ? "and a category is selected" : ""}.`;
      break;
    case "Not Found":
      printMsg = `Could not find a matching ${dataType}`;
      break;
    case "Unprocessable Content":
      printMsg = `Could not find a matching category`;
      break;
    default:
      printMsg = "Oops, something went wrong. Please try reloading the page.";
  }

  return (
    <p className={classes.errorMsg} data-testid="errorMessage">
      {printMsg}
    </p>
  );
}
