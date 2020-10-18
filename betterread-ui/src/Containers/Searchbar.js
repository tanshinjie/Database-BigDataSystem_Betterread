import React, { useState, useRef, useEffect } from 'react'
import MultiSelect from "react-multi-select-component";

import './SearchBar.css';

const SearchBar = props => {

    const [genreSelected, setGenreSelected] = useState([])
    const [reviewNumSelected, setReviewNumSelected] = useState([])
    const [minRatingSelected, setMinRatingSelected] = useState([])
    // const [searchField, setSearchField] = useState('')
    const {searchField, setSearchField} = props
    const ref = useRef()
    
    const genreOptions = [{label: 'Art', value: 1},{label: 'Biography', value: 2}]
    const reviewOptions = [{label: '0-50', value: 1},{label: '50-100', value: 2},{label: '100-200', value: 3},{label: '200+', value: 4}]
    const ratingsOptions = [{label: '5 stars', value: 5},{label: '4 stars', value: 4},{label: '3 stars', value: 3},{label: '2 stars', value: 2},{label: '1 stars', value: 1},{label: '0 stars', value: 0}]

    const handleChange = event => {
        setSearchField(event.target.value)
    }

    useEffect(() => {
        const listener = event => {
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
        <div className='search-container'>
            <input ref={ref} className='input-field' placeholder='Search by title, author,...' onChange={handleChange} value={searchField}/>
            <div className='filter-container'>

            <MultiSelect
                options={genreOptions}
                value={genreSelected}
                onChange={setGenreSelected}
                overrideStrings={{"selectSomeItems": "genre","allItemsAreSelected":null}}
                />
            <MultiSelect
                options={reviewOptions}
                value={reviewNumSelected}
                onChange={setReviewNumSelected}
                overrideStrings={{"selectSomeItems": "reviews"}}
                />
            <MultiSelect
                options={ratingsOptions}
                value={minRatingSelected}
                onChange={setMinRatingSelected}
                overrideStrings={{"selectSomeItems": "minimum ratings"}}
                />
            </div>
        </div>
    )
}

export default SearchBar