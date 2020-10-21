import React from "react";
// import React, { useState, useEffect } from "react";
import BookCard from "../Components/BookCard";
// import InfiniteScroll from "react-infinite-scroller";
import "./BookList.css";
import { Pagination } from "react-bootstrap";

const BookList = ({ items }) => {
  // function wait(ms) {
  //   var start = new Date().getTime();
  //   var end = start;
  //   while (end < start + ms) {
  //     end = new Date().getTime();
  //   }
  // }

  // const loadFunc = () => {
  //   wait(3000);
  //   const new_items = mockData.map((items, index) => {
  //     if (searchField) {
  //       if (
  //         items.author.toLowerCase().includes(searchField) ||
  //         items.title.toLowerCase().includes(searchField)
  //       ) {
  //         return <BookCard key={index} bookDetails={items} />;
  //       } else {
  //         return null;
  //       }
  //     } else {
  //       return <BookCard key={index} bookDetails={items} />;
  //     }
  //   });
  //   setItems([...items, new_items]);
  // };

  // useEffect(() => {
  //   const new_items = mockData.map((items, index) => {
  //     if (searchField) {
  //       if (
  //         items.author.toLowerCase().includes(searchField) ||
  //         items.title.toLowerCase().includes(searchField)
  //       ) {
  //         return <BookCard key={index} bookDetails={items} />;
  //       } else {
  //         return null;
  //       }
  //     } else {
  //       return <BookCard key={index} bookDetails={items} />;
  //     }
  //   });
  //   setItems(new_items);
  // }, [items, setItems, searchField]);

  return (
    <div className="content-container">
      <h4 className="results-found">{items.length} results found</h4>
      <div className="booklist-container">
        {items.map((item, index) => {
          return <BookCard bookDetails={item} key={index} />;
        })}
        {/* <InfiniteScroll
          pageStart={0}
          loadMore={loadFunc}
          hasMore={true || false}
          loader={
            <div className="loader" key={0}>
              Loading ...
            </div>
          }
        >
          {items}
        </InfiniteScroll> */}
        <Pagination />
      </div>
    </div>
  );
};

export default BookList;
