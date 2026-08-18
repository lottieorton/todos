import { useCategoryContext } from "../../context/CategoryContext";
import FormButton from "../buttons/FormButton/FormButton";
import classes from "./CategoryList.module.scss";

interface CategoryListProps {
  categoryId: number | undefined;
  handleFilter: (id: number | undefined) => void;
}

export default function CategoryList({
  categoryId,
  handleFilter,
}: CategoryListProps) {
  const { categories, isCategoriesLoading } = useCategoryContext();

  const handleSubmit = (id: number): void => {
    if (id === -1) {
      handleFilter(undefined);
      return;
    }
    handleFilter(id);
  };

  if (isCategoriesLoading) return <div>Loading now...</div>;

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
        <FormButton isSelected={categoryId === undefined}>All</FormButton>
      </form>
      {categories.map((c) => {
        return (
          <form
            key={c.id}
            className={classes.category}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(c.id);
            }}
          >
            <FormButton isSelected={categoryId === c.id}>{c.name}</FormButton>
          </form>
        );
      })}
    </section>
  );
}
