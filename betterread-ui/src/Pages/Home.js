import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import FilterBar from "../Components/FilterBar";
import BookContainer from "../Components/BookContainer";
import SearchBar from "../Components/Searchbar";
import axios from "axios";

const Home = () => {
  const [data, setData] = useState([]);
  const [filterParams, setFilterParams] = useState({
    search: "",
    ratings: {},
    categories: [],
  });

  useEffect(() => {
    console.log("retrieving", filterParams);
    axios
      .get("http://localhost:5000/", {
        params: {
          filterParams,
        },
      })
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  return (
    <Grid container>
      <Grid item xs={12}>
        <SearchBar
          setFilterParams={setFilterParams}
          filterParams={filterParams}
        />
      </Grid>
      <Grid item xs={12} style={{ height: "100px" }}></Grid>
      <Grid item xs={3}>
        <FilterBar
          styles={{ marginRight: "20px" }}
          setFilterParams={setFilterParams}
          filterParams={filterParams}
        />
      </Grid>
      <Grid item xs={8}>
        <BookContainer books={data} />
      </Grid>
    </Grid>
  );
};

export default Home;
