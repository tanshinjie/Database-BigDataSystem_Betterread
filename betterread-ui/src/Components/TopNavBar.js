import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";

const useStyle = makeStyles({
  root: {
    boxShadow: "none",
    borderStyle: "none",
    margin: "30px 10px",
    "& .MuiTypography-root": {
      color: "#7D1616",
      textDecoration: "none",
    },
  },
  logo: {
    fontFamily: "Grand Hotel, cursive",
    marginLeft: "50px",
  },
  addbook: {
    marginRight: "50px",
  },
});

const TopNavBar = () => {
  const classes = useStyle();
  return (
    <AppBar position="static" color="transparent" className={classes.root}>
      <Grid container>
        <Grid item xs={2}>
          <Typography variant="h3" className={classes.logo}>
            <Link href="/">BetterRead</Link>
          </Typography>
        </Grid>
        <Grid item xs={8}></Grid>
        <Grid item xs={2} align="right">
          <Typography className={classes.addbook} variant="h6">
            <Link href="/addbook" style={{ position: "relative", top: "10px" }}>
              Add Book
            </Link>
          </Typography>
        </Grid>
      </Grid>
    </AppBar>
  );
};

export default TopNavBar;
