import { useCategoryContext } from "../../context/CategoryContext";
import type { Todo } from "../../interfaces/Todo";
import FormButton from "../buttons/FormButton/FormButton";
import classes from "./CategoryList.module.scss";

interface CategoryListProps {
  categoryId: number | undefined;
  handleFilter: (id: number | undefined) => void;
  todos: Todo[];
}

export default function CategoryList({
  categoryId,
  handleFilter,
  todos,
}: CategoryListProps) {
  const { categories } = useCategoryContext();

  const categoriesWithCount = categories.map((c) => ({
    ...c,
    count: todos.filter((todo) => todo.category === c.name).length,
    countCompleted: todos.filter(
      (todo) => todo.category === c.name && todo.isComplete,
    ).length,
  }));

  const handleSubmit = (id: number): void => {
    if (id === -1) {
      handleFilter(undefined);
      return;
    }
    handleFilter(id);
  };

  return (
    <section
      className={`${classes.categoryList} categoryList`}
      data-testid="category-list"
    >
      <form
        key={"all"}
        className={classes.category}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(-1);
        }}
      >
        <FormButton isSelected={categoryId === undefined}>
          {`All - ${todos.filter((t) => t.isComplete).length} / ${todos.length}`}
        </FormButton>
      </form>
      {categoriesWithCount.map((c) => {
        return (
          <form
            key={c.id}
            className={classes.category}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(c.id);
            }}
          >
            <FormButton
              isSelected={categoryId === c.id}
            >{`${c.name} - ${c.countCompleted} / ${c.count}`}</FormButton>
          </form>
        );
      })}
    </section>
  );
}
