import { useCategoryContext } from "../../context/CategoryContext";
import type { Todo } from "../../interfaces/Todo";
import LargeButton from "../buttons/LargeButton/LargeButton";
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

  return (
    <section
      className={`${classes.categoryList} categoryList`}
      data-testid="category-list"
    >
      <div key={"all"} className={classes.category}>
        <LargeButton
          isSelected={categoryId === undefined}
          handleClick={() => handleFilter(undefined)}
        >
          <div>All</div>
          <div>{`${todos.filter((t) => t.isComplete).length} / ${todos.length}`}</div>
        </LargeButton>
      </div>
      {categoriesWithCount.map((c) => {
        return (
          <div key={c.id} className={classes.category}>
            <LargeButton
              isSelected={categoryId === c.id}
              handleClick={() => handleFilter(c.id)}
            >
              <div>{`${c.name}`}</div>
              <div>{`${c.countCompleted} / ${c.count}`}</div>
            </LargeButton>
          </div>
        );
      })}
    </section>
  );
}
