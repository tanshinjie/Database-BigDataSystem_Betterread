import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import TopNavBar from "./Components/TopNavBar";
import Home from "./Pages/Home";
import AddBook from "./Pages/AddBook";
import ViewReview from "./Pages/ViewReview";
import AddReview from "./Pages/AddReview";

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
