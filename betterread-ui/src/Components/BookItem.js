import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import ReactStars from "react-rating-stars-component";
import Divider from "@material-ui/core/Divider";
import { useHistory } from "react-router-dom";
import Category from "./Category";

const useStyles = makeStyles({
  root: {
    marginTop: "20px",
    flexGrow: 1,
  },
  paper: {
    padding: "20px",
    margin: "auto",
    "&:hover": {
      cursor: "pointer",
    },
    marginBottom: "20px",
  },
  image: {
    width: 250,
    height: 300,
    background: "#eee",
  },
  img: {
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "cover",
  },
  categoryList: {
    justifyContent: "space-around",
  },
});

const BookItem = (props) => {
  const classes = useStyles();
  const [elevation, setElevation] = useState(0);
  const history = useHistory();

  const redirectToReview = () => {
    history.push({
      pathname: `/review/${asin}`,
      state: { bookDetail: props.bookDetail },
    });
  };

  const {
    asin,
    imUrl,
    title,
    author,
    numberOfReview,
    overall,
    categories,
  } = props.bookDetail;

  return (
    <div className={classes.root} onClick={() => redirectToReview()}>
      <Paper
        className={classes.paper}
        elevation={elevation}
        onMouseOver={() => setElevation(4)}
        onMouseOut={() => setElevation(0)}
      >
        <Grid container>
          <Grid item xs={4}>
            <Box className={classes.image}>
              <img className={classes.img} alt="book cover" src={imUrl} />
            </Box>
          </Grid>
          <Grid item xs={8} container>
            <Grid item container direction="column">
              <Grid item xs>
                <Typography gutterBottom variant="h4">
                  {title}
                </Typography>
                <Typography variant="h5" gutterBottom>
                  by {author}
                </Typography>
                <Grid
                  container
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Grid item xs={2}>
                    <Typography variant="subtitle1" color="textSecondary">
                      overall
                    </Typography>
                  </Grid>
                  <Grid item xs={10}>
                    <ReactStars
                      edit={false}
                      count={5}
                      value={overall}
                      size={24}
                    />
                  </Grid>
                </Grid>
                <Grid container style={{ marginBottom: "10px" }}>
                  <Grid item xs={2}>
                    <Typography variant="subtitle1" color="textSecondary">
                      Reviews
                    </Typography>
                  </Grid>
                  <Grid item xs={10}>
                    <div>{numberOfReview}</div>
                  </Grid>
                </Grid>
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  gutterBottom
                >
                  Categories
                </Typography>
                <Container
                  style={{
                    width: "100%",
                  }}
                >
                  <div className={classes.categoryList}>
                    {categories.map((c) => (
                      <Category category={c} />
                    ))}
                  </div>
                </Container>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      <Divider />
    </div>
  );
};

export default BookItem;
