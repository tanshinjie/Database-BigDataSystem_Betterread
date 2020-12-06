import React from "react";
import Chip from "@material-ui/core/Chip";

const Category = (props) => {
  const { category } = props;
  return <Chip label={category} />;
};

export default Category;
