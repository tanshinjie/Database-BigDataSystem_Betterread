import React from "react";
import Grid from "@material-ui/core/Grid";
import FilterBar from "../Components/FilterBar";
import BookContainer from "../Components/BookContainer";
import SearchBar from "../Components/Searchbar";

const Home = () => {
  return (
    <Grid container>
      <Grid item xs={12}>
        <SearchBar />
      </Grid>
      <Grid item xs={12} style={{ height: "100px" }}></Grid>
      <Grid item xs={3}>
        <FilterBar styles={{ marginRight: "20px" }} />
      </Grid>
      <Grid item xs={8}>
        <BookContainer />
      </Grid>
    </Grid>
  );
};

export default Home;
