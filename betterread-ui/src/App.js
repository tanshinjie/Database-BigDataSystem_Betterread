import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import TopNavBar from "./Components/TopNavBar";
import Home from "./Containers/Home";
import AddBook from "./Containers/AddBook";
import ViewReview from "./Containers/ViewReview";
import AddReview from "./Containers/AddReview";

function App() {
  return (
    <Router>
      <TopNavBar />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/add_book">
          <AddBook />
        </Route>
        <Route path="/add_review">
          <AddReview />
        </Route>
        <Route>
          <ViewReview path="/view_review" />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
