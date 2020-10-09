import React from "react";
import "./Home.css";
import SearchBar from "../Containers/SearchBar";
import BookList from "../Containers/BookList";

const Home = () => {
  return (
    <div>
      <div className="top-container">
        <SearchBar />
      </div>
      <div className="booklist-container">
        <BookList />
      </div>
    </div>
  );
};

export default Home;
