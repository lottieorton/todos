import classes from "./MultiFieldForm.module.scss";
import { type SubmitHandler, type UseFormReturn } from "react-hook-form";
import type { MultiFieldFormData } from "../../interfaces/MultiFieldFormData";
import FormButton from "../buttons/FormButton/FormButton";
import IconButton from "../buttons/IconButton/IconButton";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { useCategoryContext } from "../../context/CategoryContext";
import { useState } from "react";

interface MultiFieldFormProps {
  formMethods: UseFormReturn<MultiFieldFormData>;
  onSubmit: SubmitHandler<MultiFieldFormData>;
  handleDelete?: (id: number) => void;
  formText: {
    categorySelection: string;
    inputPlaceholder: string;
    btn: "add" | "edit" | "editDelete";
    isBtnRounded?: boolean;
  };
  errorMsg?: string | null;
}

export default function MultiFieldForm({
  formMethods,
  handleDelete,
  onSubmit,
  formText: { categorySelection, inputPlaceholder, btn, isBtnRounded = false },
  errorMsg,
}: MultiFieldFormProps) {
  const { categories, isCategoriesLoading } = useCategoryContext();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { register, handleSubmit } = formMethods;

  const handleDeleteClick = () => {
    const selectedCategory = formMethods.getValues("categoryId");
    if (!selectedCategory) setErrorMessage("Must select a category");
    if (selectedCategory && handleDelete) {
      setErrorMessage(null);
      handleDelete(selectedCategory);
    }
  };

  const isActiveError = errorMessage || errorMsg;

  return (
    <form
      className={classes.form + " section multiFieldForm"}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className={classes.categorySection}>
        {btn === "editDelete" ? (
          <i
            className={`fa-solid fa-pencil ${classes.icon}`}
            aria-label="editIcon"
          ></i>
        ) : (
          <i
            className={`fa-solid fa-tag ${classes.icon}`}
            aria-label="categoryIcon"
          ></i>
        )}
        <select className={classes.category} {...register("categoryId")}>
          <option value="">{categorySelection}</option>
          {categories.map((c) => {
            return (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            );
          })}
        </select>
        {isCategoriesLoading && (
          <div>
            <i
              className={`fa-solid fa-spinner ${classes.loadingIcon}`}
              aria-label="loading icon"
            ></i>
          </div>
        )}
      </div>
      <div className={classes.todo}>
        <input
          type="text"
          className={classes.inputField}
          placeholder={inputPlaceholder}
          {...register("name")}
        />
        <div className={classes.btnContainer}>
          <FormButton isRounded={isBtnRounded}>
            {btn === "add" && (
              <i className="fa-solid fa-plus" aria-label="add"></i>
            )}
            {(btn === "edit" || btn === "editDelete") && "Update"}
          </FormButton>
          {btn === "editDelete" && (
            <IconButton color={"red"} handleClick={handleDeleteClick}>
              <i className="fa-solid fa-trash"></i>
            </IconButton>
          )}
        </div>
      </div>
      {isActiveError && <ErrorMessage msg={isActiveError} />}
    </form>
  );
}
