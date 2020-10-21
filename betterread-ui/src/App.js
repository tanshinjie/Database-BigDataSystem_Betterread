import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import TopNavBar from "./Components/TopNavBar";
import Home from "./Pages/Home";
import AddBook from "./Pages/AddBook";
import Review from "./Pages/Review";
import AddReview from "./Pages/AddReview";
import NoMatch from "./Pages/NoMatch";

function App() {
  return (
    <Router>
      <TopNavBar />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/addbook">
          <AddBook />
        </Route>
        <Route path="/addreview">
          <AddReview />
        </Route>
        <Route path="/book">
          <Review />
        </Route>
        <Route path="*">
          <NoMatch />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
