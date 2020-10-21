import React, { useState, useEffect } from "react";
import "./Home.css";
import SearchBar from "../Containers/Searchbar";
import BookList from "../Containers/BookList";
import { mockData } from "../mockData";

const Home = () => {
  const [searchField, setSearchField] = useState("");
  const [genreSelected, setGenreSelected] = useState([]);
  const [reviewNumSelected, setReviewNumSelected] = useState("");
  const [minRatingSelected, setMinRatingSelected] = useState("");
  const [items, setItems] = useState([]);

  const fetchBooks = () => {
    console.log("async api calls here");
    setItems(mockData);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const filter = (items) => {
    let filtered = [];
    filtered = items.filter(
      (item) =>
        item.title.toLowerCase().includes(searchField) ||
        item.author.toLowerCase().includes(searchField)
    );
    if (genreSelected.length !== 0) {
      let selected_genre = [];
      genreSelected.forEach((genre) => {
        selected_genre.push(genre.label);
      });
      filtered = filtered.filter((item) => {
        return selected_genre.includes(...item.categories);
      });
    }
    if (reviewNumSelected !== -1) {
      filtered = filtered.filter((item) => {
        return item.numOfReviews > reviewNumSelected * 50;
      });
    }
    if (minRatingSelected !== -1) {
      filtered = filtered.filter((item) => {
        return item.ratings >= minRatingSelected;
      });
    }
    return filtered;
  };

  return (
    <div>
      <div className="top-container">
        <SearchBar
          searchField={searchField}
          setSearchField={setSearchField}
          genreSelected={genreSelected}
          reviewNumSelected={reviewNumSelected}
          minRatingSelected={minRatingSelected}
          setGenreSelected={setGenreSelected}
          setReviewNumSelected={setReviewNumSelected}
          setMinRatingSelected={setMinRatingSelected}
        />
      </div>
      <div className="booklist-container">
        <BookList items={filter(items)} />
      </div>
    </div>
  );
};

export default Home;
