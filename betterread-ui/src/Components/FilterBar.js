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

const FilterBar = () => {
  const [ratingsFilter, setRatingsFilter] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  const classes = useStyles();
  const renderCategory = (categories) => {
    return (
      <div>
        {categories.map((category) => {
          return category.map((cItem) => {
            return <CategoryItem label={cItem} key={cItem} />;
          });
        })}
      </div>
    );
  };

  const handleChange = (event) => {
    let newRatingFilter = ratingsFilter;
    newRatingFilter[event.target.name] = !newRatingFilter[event.target.name];
    setRatingsFilter([...newRatingFilter]);
  };

  const renderCheckbox = () => {
    return (
      <FormGroup>
        {ratingsFilter.map((checked, i) => {
          return (
            <FormControlLabel
              key={i}
              style={{ color: checked ? "#333" : "#aaa" }}
              className={classes.label}
              control={
                <Checkbox
                  checked={checked}
                  onChange={handleChange}
                  name={i + ""}
                  style={{ color: checked ? "#333" : "#aaa" }}
                />
              }
              label={
                <ReactStars count={5} value={5 - i} edit={false} size={24} />
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

const categories = [
  ["Aeronautics & Astronautics", "Aeronautics & Space", "Aerospace"],
  ["Beverages & Wine", "Bhagavad Gita", "Bhutan", "Bible"],
  ["Coaching", "Coal", "Coastal West Africa", "Cocoa"],
  ["Drama", "Drama & Plays", "Drama & Theater", "Drawing"],
  ["Drama", "Drama & Plays", "Drama & Theater", "Drawing"],
  ["Drama", "Drama & Plays", "Drama & Theater", "Drawing"],
  ["Drama", "Drama & Plays", "Drama & Theater", "Drawing"],
  ["Drama", "Drama & Plays", "Drama & Theater", "Drawing"],
  ["Drama", "Drama & Plays", "Drama & Theater", "Drawing"],
];
