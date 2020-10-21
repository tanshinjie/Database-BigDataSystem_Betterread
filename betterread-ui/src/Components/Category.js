import React from "react";
import Badge from "react-bootstrap/Badge";

const Category = (props) => {
  const { category } = props;
  return (
    <Badge pill variant="light">
      {category}
    </Badge>
  );
};

export default Category;
