import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";

const useStyles = makeStyles({
  root: {
    minWidth: 800,
    minHeight: 800,
  },
  title: {
    fontFamily: "Grand Hotel, cursive",
    color: "#7D1616",
  },
  paper: {
    flexGrow: 1,
    borderRadius: "40px",
  },
  input: {
    width: "100%",
  },
  label: {
    marginTop: "20px",
  },
  form: {
    padding: "50px",
    minHeight: "800px",
    position: "relative",
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

const AddBook = () => {
  const classes = useStyles();
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

  const addBook = () => {
    // TODO: Post request to add book
    handleToggle();
    setTimeout(() => setOpenSB(true), 3000);
  };

  return (
    <Container className={classes.root}>
      <Paper elevation={2} className={classes.paper} round={true}>
        <Container className={classes.form}>
          <Typography variant="h3" className={classes.title}>
            Add a New Book
          </Typography>
          <br />
          <Typography variant="h6" className={classes.label}>
            Author
          </Typography>
          <TextField variant="outlined" className={classes.input} />
          <Typography variant="h6" className={classes.label}>
            Title
          </Typography>
          <TextField variant="outlined" className={classes.input} />
          <Typography variant="h6" className={classes.label}>
            Description
          </Typography>
          <TextareaAutosize
            rowsMin={10}
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
            className={classes.button}
            variant="contained"
            size="large"
            onClick={addBook}
          >
            Add
          </Button>
        </Container>
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

export default AddBook;

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
