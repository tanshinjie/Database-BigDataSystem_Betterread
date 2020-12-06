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
import { Link } from "@material-ui/core";
import Category from "../Components/Category";

const useStyles = makeStyles({
  container: {
    maxWidth: "1600px",
    display: "flex",
  },
  paper: {
    flexGrow: 1,
    borderRadius: "40px",
    minHeight: "400px",
  },
  paper_side: {
    padding: "20px",
    marginBottom: "20px",
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
  related: {
    padding: "20px",
    marginBottom: "20px",
    "& h4": {
      padding: "20px",
    },
  },
  related_container: {
    maxHeight: "600px",
    overflow: "auto",
  },
  loading: {
    borderRadius: "40px",
    minHeight: "400px",
    textAlign: "center",
    "& h4": { paddingTop: "20px" },
  },
});

const Review = () => {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const location = useLocation();
  const [asin] = useState(location.pathname.split("/").pop());
  const [bookDetail, setBookDetail] = useState(null);
  const history = useHistory();

  const redirectToAddReview = () => {
    history.push({
      pathname: `/newreview/${asin}`,
    });
  };

  useEffect(() => {
    if (!bookDetail) {
      axios
        .all([
          axios.get(
            `http://${window.location.hostname}:5000/api/book?asin=${asin}`
          ),
          axios.get(
            `http://${window.location.hostname}:5000/api/review?asin=${asin}`
          ),
        ])
        .then(
          axios.spread((...responses) => {
            const bookDetail = responses[0].data;
            const reviews = responses[1].data.reviews;
            console.log(bookDetail);
            console.log(reviews);
            setBookDetail(bookDetail);
            setData(reviews);
          })
        )
        .catch((err) => console.log(err));
    }
  }, [bookDetail, asin]);

  const renderReviews = () => {
    return (
      data.length > 0 &&
      data.map((d, i) => {
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
      <Grid container spacing={3}>
        <Grid item xs={9}>
          {bookDetail ? (
            <Paper item xs={9} elevation={2} className={classes.paper}>
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
                            <Typography
                              variant="subtitle1"
                              color="textSecondary"
                            >
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
                          }}
                        >
                          <div className={classes.categoryList}>
                            {bookDetail.categories.map((c) => (
                              <Category category={c} />
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
          ) : (
            <Paper className={classes.loading}>
              <Typography variant="h4">Loading...</Typography>
            </Paper>
          )}
        </Grid>
        <Grid item xs={3}>
          <Paper elevation={2} className={classes.paper_side}>
            <Typography variant="body">Also bought</Typography>
            <div className={classes.related_container}>
              {bookDetail &&
                bookDetail.related.also_bought.map((b) => {
                  return (
                    <Link href={`/review/${b.asin}`} key={b._id}>
                      <img src={b.imUrl} alt={b.title} />
                    </Link>
                  );
                })}
            </div>
          </Paper>
          <Paper elevation={2} className={classes.paper_side}>
            <Typography variant="body">Buy after viewing</Typography>
            <div className={classes.related_container}>
              {bookDetail &&
                bookDetail.related.buy_after_viewing.map((b) => {
                  return (
                    <Link href={`/review/${b.asin}`} key={b._id}>
                      <img src={b.imUrl} alt={b.title} />
                    </Link>
                  );
                })}
            </div>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Review;
