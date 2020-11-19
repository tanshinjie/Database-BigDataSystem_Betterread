import React from "react";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Pagination from "@material-ui/lab/Pagination";
import { makeStyles } from "@material-ui/core/styles";
import BookItem from "./BookItem";

const useStyles = makeStyles({
  root: {
    padding: "20px",
    width: "100%",
    minHeight: 400,
    borderStyle: "none",
    borderRadius: "20px",
    position: "relative",
  },
  container: {
    margin: "20px 0px",
  },
  pagination: {
    position: "absolute",
    bottom: "20px",
  },
});

const REVIEW_PER_PAGE = 10;

const BookContainer = (props) => {
  const { books } = props;
  const classes = useStyles();
  const [page, setPage] = React.useState(1);
  const handleChange = (event, value) => {
    setPage(value);
  };

  const numberOfPage = Math.ceil(books.length / REVIEW_PER_PAGE);

  const renderBooklist = () => {
    const startIndex = (page - 1) * REVIEW_PER_PAGE;
    const endIndex = page * REVIEW_PER_PAGE;
    const slicedData = books.slice(startIndex, endIndex);
    return slicedData.map((d) => (
      <BookItem key={d.asin} bookDetail={d}></BookItem>
    ));
  };

  const renderPlaceholder = () => {
    return (
      <Typography
        variant="h2"
        style={{ textAlign: "center", marginTop: "100px" }}
      >
        No result founds
      </Typography>
    );
  };

  const renderContent = () => {
    return (
      <>
        <Typography variant="subtitle1">
          Showing {page === 1 ? 1 : (page - 1) * REVIEW_PER_PAGE + 1} -{" "}
          {page * REVIEW_PER_PAGE} of {books.length} results found
        </Typography>
        <Container className={classes.container}>{renderBooklist()}</Container>
        <Pagination count={numberOfPage} page={page} onChange={handleChange} />
      </>
    );
  };

  return (
    <Container>
      <Paper elevation={2} className={classes.root}>
        {books.length === 0 ? renderPlaceholder() : renderContent()}
      </Paper>
    </Container>
  );
};

export default BookContainer;
