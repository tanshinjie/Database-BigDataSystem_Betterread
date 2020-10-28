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
  const [selected, setSelected] = useState(false);
  const classes = useStyles({ selected });

  const toggleSelect = () => {
    setSelected(!selected);
  };

  return (
    <div className={classes.root} onClick={toggleSelect}>
      {props.label}
    </div>
  );
};
export default CategoryItem;
