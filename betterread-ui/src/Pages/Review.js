import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import ReactStars from "react-rating-stars-component";
import axios from "axios";
import { randomColor } from "../Utils/functions";
import { useHistory, useLocation } from "react-router-dom";

const useStyles = makeStyles({
  container: {
    maxWidth: "1400px",
    display: "flex",
  },
  paper: {
    flexGrow: 1,
    borderRadius: "40px",
  },
  image: {
    width: 250,
    height: 350,
    background: "#eee",
    objectFit: "cover",
  },
  innercontainer: {
    padding: "40px",
  },
  hero: {
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  avatar: {
    width: "100px",
    height: "100px",
    fontSize: "30px",
    marginBottom: "30px",
  },
  review: {
    marginBottom: "50px",
  },
  button: {
    padding: "10px 20px",
    color: "#eee",
    backgroundColor: "#7D1616 !important",
    margin: "20px",
  },
});

const Review = () => {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const location = useLocation();
  const bookDetail = location.state.bookDetail;
  const history = useHistory();

  console.log(bookDetail);

  const redirectToAddReview = () => {
    history.push({
      pathname: `/newreview/${bookDetail.asin}`,
      state: {
        title: bookDetail.title,
        author: bookDetail.author,
        imUrl: bookDetail.imUrl,
        asin: bookDetail.asin,
      },
    });
  };

  useEffect(() => {
    const asin = location.state.bookDetail.asin;
    if (data.length === 0) {
      console.log("Getting review of asin", asin);
      axios
        .get(`http://${window.location.hostname}:5000/api/review/${asin}`)
        .then((res) => {
          console.log(res.data);
          const reviews = res.data.reviews;
          if (reviews) {
            setData(reviews);
          }
        })
        .catch((err) => console.log(err));
    }
  }, [data.length, setData, location.state.bookDetail.asin]);

  const renderReviews = () => {
    return (
      data.length > 0 &&
      data.map((d, i) => {
        console.log(d);
        return (
          <div className={classes.review} key={i}>
            <Grid container>
              <Grid item xs={2} className={classes.hero}>
                <Avatar
                  className={classes.avatar}
                  style={{ backgroundColor: randomColor() }}
                >
                  {d.reviewerName.charAt(0)}
                </Avatar>
                <Typography style={{ marginBottom: "15px" }}>rated</Typography>
                <ReactStars
                  edit={false}
                  count={5}
                  value={d.overall}
                  size={40}
                />
              </Grid>
              <Grid item xs={10}>
                <Typography variant="h4" gutterBottom>
                  {d.reviewerName}
                </Typography>
                <Typography variant="h5" gutterBottom>
                  Summary
                </Typography>
                <Typography gutterBottom style={{ padding: "0px 20px" }}>
                  "{d.summary}"
                </Typography>
                <Typography variant="h5" gutterBottom>
                  Review
                </Typography>
                <Typography gutterBottom style={{ padding: "0px 20px" }}>
                  "{d.reviewText}"
                </Typography>
              </Grid>
              <Divider />
            </Grid>
          </div>
        );
      })
    );
  };
  return (
    <Container className={classes.container}>
      <Paper elevation={2} className={classes.paper}>
        <Grid container className={classes.innercontainer}>
          <Grid item xs={12} container style={{ marginBottom: "50px" }}>
            <Grid item container xs={4} justify="center">
              <img
                className={classes.image}
                alt="book cover"
                src={bookDetail.imUrl}
              />
            </Grid>
            <Grid item xs={8}>
              <Grid item xs container direction="column" spacing={2}>
                <Grid item xs>
                  <Typography gutterBottom variant="h4" component={"h4"}>
                    {bookDetail.title} Title placeholder
                  </Typography>
                  <Typography component="h6" gutterBottom>
                    by {bookDetail.author} Author placeholder
                  </Typography>
                  <Grid
                    container
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <Grid item xs={2}>
                      <Typography variant="subtitle1" color="textSecondary">
                        Ratings
                      </Typography>
                    </Grid>
                    <Grid item xs={10}>
                      <ReactStars
                        edit={false}
                        count={5}
                        value={bookDetail.overall}
                        size={24}
                      />
                    </Grid>
                  </Grid>
                  <Grid container style={{ marginBottom: "10px" }}>
                    <Grid item xs={2}>
                      <Typography
                        variant="subtitle1"
                        color="textSecondary"
                        gutterBottom
                      >
                        Reviews
                      </Typography>
                    </Grid>
                    <Grid item xs={10}>
                      <Typography>{bookDetail.numberOfReview}</Typography>
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
                      overflowY: "scoll",
                    }}
                  >
                    <div className={classes.categoryList}>
                      {bookDetail.categories.map((c) => (
                        <span key={c} className={classes.categoryItem}>
                          {c}
                        </span>
                      ))}
                    </div>
                  </Container>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Button
            className={classes.button}
            variant="outlined"
            onClick={() => redirectToAddReview()}
          >
            Add Review
          </Button>
          <Grid item xs={12}>
            <Typography style={{ marginBottom: "20px" }}>
              Showing {data.length} of {data.length} results found
            </Typography>
            <Box>{renderReviews()}</Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Review;
