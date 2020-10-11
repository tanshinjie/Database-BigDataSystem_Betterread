import React, {useState, useEffect} from "react";
import BookCard from "../Components/BookCard";
import { mockData } from "../mockData";
import InfiniteScroll from 'react-infinite-scroller';
import './BookList.css'

const BookList = props => {
  const {searchField} = props
  const [items, setItems] = useState([])

  function wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
    }
  }

  const loadFunc = () => {
    wait(3000); 
    const new_items = mockData.map((items,index) => {
      if (searchField) {
        if (items.author.toLowerCase().includes(searchField) || items.title.toLowerCase().includes(searchField)) {
          return <BookCard key={index} bookDetails={items} />
        } else {
          return null;
        }
      } else {
        return <BookCard key={index} bookDetails={items} />
      }
    })
    setItems([...items,new_items])
  }

  useEffect(() => {
    if (items.length === 0) {
      const new_items = mockData.map((items,index) => {
        if (searchField) {
          if (items.author.toLowerCase().includes(searchField) || items.title.toLowerCase().includes(searchField)) {
            return <BookCard key={index} bookDetails={items} />
          } else {
            return null
          }
        } else {
          return <BookCard key={index} bookDetails={items} />
        }
      })

      setItems(new_items)
    }

  }, [items,setItems,searchField])

  return (
    <div className='content-container'>
      <h4 className='results-found'>{items.length} results found</h4>
      <div className='booklist-container'>
      <InfiniteScroll
        pageStart={0}
        loadMore={loadFunc}
        hasMore={true || false}
        loader={<div className="loader" key={0}>Loading ...</div>}
        >
        {items}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default BookList;
