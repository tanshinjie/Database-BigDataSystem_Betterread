import React, { useState } from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import CategoryItem from "./CategoryItem";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import ReactStars from "react-rating-stars-component";
import { categories } from "../Utils/constant";

const useStyles = makeStyles({
  root: {
    padding: "20px",
    maxWidth: 400,
    minHeight: 400,
    maxHeight: 1200,
    borderStyle: "none",
    borderRadius: "20px",
    position: "relative",
  },
  categoryBox: {
    maxHeight: 600,
    overflowY: "scroll",
    paddingLeft: "20px",
  },
  label: {
    padding: "0px",
    margin: "0px",
  },
});

const FilterBar = (props) => {
  const { filterParams, setFilterParams } = props;
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [ratingsFilter, setRatingsFilter] = useState({
    5: false,
    4: false,
    3: false,
    2: false,
    1: false,
    0: false,
  });

  const classes = useStyles();
  const renderCategory = (categories) => {
    return (
      <div>
        {categories.map((cItem, i) => {
          return (
            <CategoryItem
              label={cItem}
              key={cItem + i}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
            />
          );
        })}
      </div>
    );
  };

  const handleChange = (target) => {
    let newRatingFilter = ratingsFilter;
    newRatingFilter[target] = !newRatingFilter[target];
    setRatingsFilter({ ...newRatingFilter });
  };

  const applyFilter = () => {
    setFilterParams({
      ...filterParams,
      ratings: ratingsFilter,
      categories: categoryFilter,
    });
  };

  const renderCheckbox = () => {
    return (
      <FormGroup>
        {Object.keys(ratingsFilter).map((rating) => {
          return (
            <FormControlLabel
              key={rating}
              style={{ color: ratingsFilter[rating] ? "#333" : "#aaa" }}
              className={classes.label}
              control={
                <Checkbox
                  checked={ratingsFilter[rating]}
                  onChange={() => handleChange(rating)}
                  name={rating}
                  style={{ color: ratingsFilter[rating] ? "#333" : "#aaa" }}
                />
              }
              label={
                <ReactStars
                  count={5}
                  value={parseInt(rating)}
                  edit={false}
                  size={24}
                />
              }
            ></FormControlLabel>
          );
        })}
      </FormGroup>
    );
  };

  return (
    <Container>
      <Paper elevation={2} className={classes.root}>
        <Typography variant="h6" style={{ display: "inline-block" }}>
          Refine your search
        </Typography>
        <Button
          style={{ float: "right", margin: "0px 10px" }}
          variant="contained"
          color="default"
          disableElevation
          onClick={applyFilter}
        >
          Apply
        </Button>
        <Typography variant="h6">Genre</Typography>
        <Box className={classes.categoryBox}>{renderCategory(categories)}</Box>
        <Typography variant="h6" style={{ marginTop: "10px" }}>
          Average ratings
        </Typography>
        <Box>{renderCheckbox()}</Box>
      </Paper>
    </Container>
  );
};

export default FilterBar;
