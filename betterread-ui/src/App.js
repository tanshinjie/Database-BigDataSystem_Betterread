import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import TopNavBar from "./Components/TopNavBar";
import Home from "./Pages/Home";
import AddBook from "./Pages/AddBook";
import Review from "./Pages/Review";
import AddReview from "./Pages/AddReview";
import NoMatch from "./Pages/NoMatch";
import Footer from "./Components/Footer";
import "./App.css";

function App() {
  return (
    <Router>
      <TopNavBar />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/newbook">
          <AddBook />
        </Route>
        <Route path="/newreview">
          <AddReview />
        </Route>
        <Route path="/review">
          <Review />
        </Route>
        <Route path="*">
          <NoMatch />
        </Route>
      </Switch>
      <Footer />
    </Router>
  );
}

export default App;
