import React, { useRef, useEffect } from "react";
import MultiSelect from "react-multi-select-component";

import "./Searchbar.css";

const SearchBar = (props) => {
  const { genreSelected, setGenreSelected } = props;
  const { reviewNumSelected, setReviewNumSelected } = props;
  const { minRatingSelected, setMinRatingSelected } = props;
  const { searchField, setSearchField } = props;
  const ref = useRef();

  const genreOptions = [
    { label: "Art", value: 1 },
    { label: "Biography", value: 2 },
    { label: "Comic", value: 3 },
  ];
  const reviewOptions = [
    { label: "number of reviews", value: -1 },
    { label: "> 0 ", value: 0 },
    { label: "> 50", value: 1 },
    { label: "> 100  ", value: 2 },
    { label: "> 150 ", value: 3 },
    { label: "> 200 ", value: 4 },
    { label: "> 250", value: 5 },
  ];
  const ratingsOptions = [
    { label: "minimum ratings", value: -1 },
    { label: "5 stars", value: 5 },
    { label: "4 stars", value: 4 },
    { label: "3 stars", value: 3 },
    { label: "2 stars", value: 2 },
    { label: "1 stars", value: 1 },
    { label: "0 stars", value: 0 },
  ];

  const handleChange = (event) => {
    setSearchField(event.target.value);
  };

  useEffect(() => {
    const listener = (event) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        console.log("Enter key was pressed. Run your function.");
      }
    };
    ref.current.addEventListener("keydown", listener);
    return () => {
      ref.removeEventListener("keydown", listener);
    };
  }, []);

  return (
    <div className="search-container">
      <input
        ref={ref}
        className="input-field"
        placeholder="Search by title, author,..."
        onChange={handleChange}
        value={searchField}
      />
      <div className="filter-container">
        <MultiSelect
          options={genreOptions}
          value={genreSelected}
          onChange={setGenreSelected}
          overrideStrings={{
            selectSomeItems: "genre",
            allItemsAreSelected: null,
          }}
        />
        <select
          options={reviewOptions}
          value={reviewNumSelected}
          onChange={(e) => setReviewNumSelected(e.target.value)}
        >
          {reviewOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          options={ratingsOptions}
          value={minRatingSelected}
          onChange={(e) => setMinRatingSelected(e.target.value)}
        >
          {ratingsOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SearchBar;
