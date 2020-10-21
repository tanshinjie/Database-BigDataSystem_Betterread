import React, { useState } from "react";
import "./Home.css";
import SearchBar from "../Containers/Searchbar";
import BookList from "../Containers/BookList";

const Home = () => {
  const [searchField, setSearchField] = useState("");

  return (
    <div>
      <div className="top-container">
        <SearchBar searchField={searchField} setSearchField={setSearchField} />
      </div>
      <div className="booklist-container">
        <BookList searchField={searchField} />
      </div>
    </div>
  );
};

export default Home;
