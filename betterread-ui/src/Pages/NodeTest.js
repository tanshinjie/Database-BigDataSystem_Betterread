import React, { useState, useEffect } from "react";
//import Axios from "axios";

const NodeTest = () => {
    const {bookTitle,setBookTitle} = useState("");
    const {bookReview,setBookReview} = useState("");
    const {bookReviewList,setBookReviewList} = useState("");

    const searchBook = () => {
        // Axios.get("", { //api to get data from database
        //     bookTitle: bookTitle,
        //     bookReview: bookReview,
        // }).then(() => {
        //     alert("Searched for book")
        // })
    }

    return (
        <div>
        <h1>Node Mysql test</h1>
            <div>
                
                <label>Asin Book Number</label> <br></br>
                <input type="text" name="asin number"/> <br></br> <br></br>
                <button onClick={searchBook}>Search for Reviews</button>

                {/* {bookReviewList.map((val) => {
                    return ( //bookreview should be a list... idk the val for number of reivews.
                        <h1>
                            Book Title: {val.bookTitle} | Review: {val.bookReview} 
                            Number of book reviews: 
                        </h1>
                    );
                })} */}
            </div>
        </div>
    );
};

export default NodeTest;
