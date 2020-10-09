import React from "react";
import BookCard from "../Components/BookCard";
import { mockData } from "../mockData";

const BookList = () => {
  const numOfResult = mockData.length;
  return (
    <div>
      <div>{numOfResult} results found</div>
      <div>
        {mockData.map((items,index) => (
          <BookCard key={index} bookDetails={items} />
        ))}
      </div>
    </div>
  );
};

export default BookList;
