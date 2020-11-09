import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    "&:hover": {
      cursor: "pointer",
    },
    color: (props) => (props.selected ? "#333" : "#aaa"),
  },
});
const CategoryItem = (props) => {
  const { categoryFilter, setCategoryFilter } = props;
  const [selected, setSelected] = useState(false);
  const classes = useStyles({ selected });

  const toggleSelect = (label) => {
    if (selected) {
      const newCategoryFilter = [...categoryFilter];
      newCategoryFilter.splice(newCategoryFilter.indexOf(label), 1);
      setCategoryFilter(newCategoryFilter);
    } else {
      const newCategoryFilter = [...categoryFilter];
      newCategoryFilter.push(label);
      setCategoryFilter(newCategoryFilter);
    }
    setSelected(!selected);
  };

  return (
    <div
      className={classes.root}
      onClick={() => toggleSelect(props.label)}
      name={props.label}
    >
      {props.label}
    </div>
  );
};
export default CategoryItem;
