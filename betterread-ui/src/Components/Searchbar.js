import React from "react";
import { Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles({
  container: {
    width: "60%",
    borderRadius: "40px",
    boxShadow: "0px 3px 6px",
    borderStyle: "none",
    background: "white",
    opacity: "80%",
    color: "grey",
    fontSize: "large",
    transition: "opacity 0.3s",
    display: "flex",
    alignItems: "center",
    "&:hover, &:focus": {
      opacity: "100%",
    },
  },
  input: {
    padding: "30px",
    borderStyle: "none",
    borderRadius: "20px 20px",
    width: "90%",
    "&:focus": {
      outline: "none",
    },
  },
  icon: {
    width: "10%",
    "&:hover": {
      cursor: "pointer",
    },
  },
});

const SearchBar = (props) => {
  const { searchField, setSearchField } = props;
  const classes = useStyles();

  const handleChange = (event) => {
    // setSearchField(event.target.value);
  };

  return (
    <Container className={classes.container}>
      <input
        className={classes.input}
        placeholder="Search by title or author"
        onChange={handleChange}
        value={searchField}
      />
      <SearchIcon className={classes.icon} fontSize="large" />
    </Container>
  );
};

export default SearchBar;
