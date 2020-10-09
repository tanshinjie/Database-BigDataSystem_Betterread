import React from 'react'
import { Multiselect } from 'multiselect-react-dropdown';

import './SearchBar.css';

const SearchBar = () => {
    const genreOptions = [{name: 'Art', id: 1},{name: 'Biography', id: 2}]
    const reviewOptions = [{name: '0-50', id: 1},{name: '50-100', id: 2},{name: '100-200', id: 3},{name: '200+', id: 4}]
    const ratingsOptions = [{name: '5 stars', id: 5},{name: '4 stars', id: 4},{name: '3 stars', id: 3},{name: '2 stars', id: 2},{name: '1 stars', id: 1},{name: '0 stars', id: 0}]
    return (
        <div className='search-container'>
            <input className='input-field' placeholder='Search by title, author,...' />
            <div className='filter-container'>
                <Multiselect options={genreOptions} isObject={true} displayValue='name' placeholder='genre' />
                <Multiselect options={reviewOptions} isObject={true} displayValue='name' placeholder='reviews'/>
                <Multiselect options={ratingsOptions} isObject={true} displayValue='name' placeholder='minimum ratings'/>
            </div>
        </div>
    )
}

export default SearchBar
