import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import ReactStars from "react-rating-stars-component";
import { generateName, randomColor } from "../Utils/functions";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

const useStyles = makeStyles({
  left: {
    textAlign: "center",
    flexGrow: 1,
  },
  right: {
    flexGrow: 10,
    float: "right",
    marginLeft: "40px",
  },
  title: {
    fontFamily: "Grand Hotel, cursive",
  },
  paper: {
    borderRadius: "40px",
    padding: "40px",
    display: "flex",
    minHeight: "800px",
  },
  reviewForm: {
    padding: "40px",
    position: "relative",
    height: "100%",
    borderRadius: "40px",
  },
  button: {
    position: "absolute",
    bottom: "20px",
    right: "30px",
    padding: "20px 40px",
    borderRadius: "40px",
    background: "#7D1616",
    color: "#eee",
  },
  backdrop: {
    zIndex: 20,
    color: "#fff",
  },
});

const AddReview = () => {
  const classes = useStyles();
  const [name, setName] = useState("Anonymous");
  const [color] = useState(randomColor());
  const [rating, setRating] = useState(0);
  const [openBD, setOpenBD] = useState(false);
  const [openSB, setOpenSB] = useState(false);
  const handleCloseBD = () => {
    setOpenBD(false);
  };

  const handleCloseSB = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSB(false);
  };

  const handleToggle = () => {
    setOpenBD(!openBD);
  };

  const addReview = () => {
    // TODO: Post request to add book
    handleToggle();
    setTimeout(() => setOpenSB(true), 3000);
  };

  const generateRandomName = () => {
    const name = generateName();
    setName(name);
  };

  const handleRatingChange = (newValue) => {
    setRating(newValue);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  return (
    <Container>
      <Paper className={classes.paper}>
        <Box className={classes.left}>
          <Typography
            variant="h3"
            style={{
              fontFamily: "Grand Hotel, cursive",
              color: "#7D1616",
              marginBottom: "20px",
            }}
          >
            What do you think about the book
          </Typography>
          <Typography variant="h4" style={{ marginBottom: "10px" }}>
            Title
          </Typography>
          <Typography variant="h5" style={{ marginBottom: "10px" }}>
            by Author
          </Typography>
          <img
            src=""
            alt="book cover"
            style={{
              width: "250px",
              height: "350px",
              backgroundColor: "#eee",
              objectFit: "cover",
              display: "inline-block",
            }}
          />
        </Box>
        <Box className={classes.right}>
          <Paper elevation={4} className={classes.reviewForm}>
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
                marginBottom: "40px",
              }}
            >
              <Avatar
                component="span"
                style={{
                  width: "100px",
                  height: "100px",
                  backgroundColor: color,
                }}
              >
                {name ? name[0] + name[name.indexOf(" ") + 1] : "-"}
              </Avatar>
              <Box style={{ marginLeft: "10px", flexGrow: 1 }}>
                <TextField
                  variant="outlined"
                  style={{ width: "75%" }}
                  value={name}
                  onChange={handleNameChange}
                />
                <Button
                  variant="contained"
                  style={{ height: "100%", padding: "15px" }}
                  onClick={generateRandomName}
                >
                  Generate
                </Button>
              </Box>
            </Box>
            <Typography>Ratings</Typography>
            <ReactStars
              count={5}
              onChange={handleRatingChange}
              activeColor="#ffd700"
              size={50}
              value={rating}
            />
            <Typography>Summary</Typography>
            <TextField
              variant="outlined"
              style={{ width: "100%", marginBottom: "30px" }}
            />
            <Typography>Review</Typography>
            <TextareaAutosize
              rowsMin={3}
              rowsMax={15}
              style={{
                resize: "none",
                width: "100%",
                marginBottom: "50px",
                padding: "15px",
                outlineColor: "blue",
                fontFamily: "Roboto",
              }}
            />
            <Button
              color="primary"
              variant="contained"
              className={classes.button}
              onClick={addReview}
            >
              Add reivew
            </Button>
          </Paper>
        </Box>
      </Paper>
      <Backdrop
        className={classes.backdrop}
        open={openBD}
        onClick={handleCloseBD}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar open={openSB} autoHideDuration={6000} onClose={handleCloseSB}>
        <Alert onClose={handleCloseSB} severity="success">
          This is a success message!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AddReview;

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
