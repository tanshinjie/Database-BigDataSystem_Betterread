import React, { useState, useEffect,useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./Review.css";
import Category from "../Components/Category";

const Review = () => {
  
  const [reviewsText,setreviewsText] = useState([])

  useEffect(()=>{
    fetch('http://localhost:5000/review/B000FC1TG2',{ //fetching data from backend review.js, not fully implemented
        
    }).then(res=>res.json())
    .then(result=>{
        console.log(result)
        setreviewsText(result)
    }).catch(err=>console.log(err))
  },[])

  
  return (
    
    <Container className="container">
      <Row>
        <Col xs={4}>
          <img src={book_metadata["imUrl"]} alt="book cover" />
        </Col>
        <Col>
          <div>
            <div>Asin:</div>
            <div>{book_metadata["asin"]}</div>
            <br />
            <div>Description:</div>
            <div>{book_metadata["description"]}</div>
            <br />
            <div>Price:</div>
            <div>{book_metadata["price"]} USD</div>
            <br />
            <div>Categories:</div>
            <div>
              {book_metadata["categories"].map((category) => (
                <Category category={category} key={category}></Category>
              ))}
            </div>
          </div>
        </Col>
      </Row>
      <br />
      <h4>Reviews ({reviews.length})</h4>
      {reviews.map((review) => (
        <Container key={review.reviewerID}>
          <Row>
            <Col xs={2}>
              <Row>Reviewer:</Row>
              {/* <Row>Helpfulness:</Row> */}
              <Row>Ratings:</Row>
              <Row>Summary:</Row>
              <Row>Reviews:</Row>
            </Col>
            <Col>
              <Row>{review.reviewerName}</Row>
              <Row>{review.overall}</Row>
              {/* <Row>{review.helpful}</Row> */}
              <Row>"{review.summary}"</Row>
              <Row>"{review.reviewText}"</Row>
            </Col>
          </Row>
        </Container>
      ))}
    </Container>
    
  );
};

export default Review;



const book_metadata = {
  asin: "1603420304",
  description:
    "In less time and for less money than it takes to order pizza, you can make it yourself!Three harried but heatlh-conscious college students compiled and tested this collection of more than 200 tasty, hearty, inexpensive recipes anyone can cook -- yes, anyone!Whether you're short on cash, fearful of fat, counting your calories, or just miss home cooking, The Healthy College Cookbook offers everything you need to make good food yourself.",
  price: 7.69,
  imUrl:
    "http://ecx.images-amazon.com/images/I/51IEqPrF%2B9L._BO2,204,203,200_PIsitb-sticker-v3-big,TopRight,0,-55_SX278_SY278_PIkin4,BottomRight,1,22_AA300_SH20_OU01_.jpg",
  related: {
    also_viewed: [
      "B001OLRKLQ",
      "B004J35JIC",
      "B00505UP8M",
      "B004GTLKEQ",
      "B005KWMS8U",
      "B00BS03TYU",
      "B001MT5NXW",
      "B00A86JE3K",
      "B00D694Y9U",
      "B00DSVUVXY",
      "B008EN3W6Y",
      "B00BS03W5Q",
      "B008161J1O",
      "B0089LOJH2",
      "B00ENSBJYQ",
      "B00C7C040U",
      "B00DH410VY",
      "B00CMVFW4O",
      "B00C89GS1Q",
      "B0035FZJ9Y",
      "B004GTLFUK",
      "B00H24WT2E",
      "B00CVS44OW",
      "B00C5W32QK",
      "B00HY0KTPK",
      "B00BJ8IPJU",
      "B00JEOMV1E",
      "B0041KKLNQ",
      "B00CVS2JYY",
      "B00CTVOVD0",
      "B00ET594CC",
    ],
    buy_after_viewing: ["B004J35JIC", "B0089LOJH2"],
  },
  categories: [
    ["Books", "Cookbooks, Food & Wine", "Quick & Easy"],
    ["Books", "Cookbooks, Food & Wine", "Special Diet"],
    [
      "Books",
      "Cookbooks, Food & Wine",
      "Vegetarian & Vegan",
      "Non-Vegan Vegetarian",
    ],
    ["Kindle Store", "Kindle eBooks", "Cookbooks, Food & Wine", "Quick & Easy"],
    [
      "Kindle Store",
      "Kindle eBooks",
      "Cookbooks, Food & Wine",
      "Special Diet",
      "Healthy",
    ],
    [
      "Kindle Store",
      "Kindle eBooks",
      "Cookbooks, Food & Wine",
      "Vegetables & Vegetarian",
    ],
  ],
};

const reviews = [
  {
    reviewerID: "A1F6404F1VG29J",
    asin: "B000F83SZQ",
    reviewerName: "Avidreader",
    helpful: [0, 0],
    reviewText: "I enjoy vintage books and movies so I enjoyed reading this book.  The plot was unusual.  Don't think killing someone in self-defense but leaving the scene and the body without notifying the police or hitting someone in the jaw to knock them out would wash today.Still it was a good read for me.",
    overall: 5.0,
    summary: "Nice vintage story",
    unixReviewTime: 1399248000,
    reviewTime: "05 5, 2014",
  },
  {
    reviewerID: "AN0N05A9LIJEQ",
    asin: "B000F83SZQ",
    reviewerName: "critters",
    helpful: [2, 2],
    reviewText:
      "This book is a reissue of an old one; the author was born in 1910. It's of the era of, say, Nero Wolfe. The introduction was quite interesting, explaining who the author was and why he's been forgotten; I'd never heard of him.The language is a little dated at times, like calling a gun a &#34;heater.&#34;  I also made good use of my Fire's dictionary to look up words like &#34;deshabille&#34; and &#34;Canarsie.&#34; Still, it was well worth a look-see.",
    overall: 4.0,
    summary: "Different...",
    unixReviewTime: 1388966400,
    reviewTime: "01 6, 2014",
  },
  {
    reviewerID: "A795DMNCJILA6",
    asin: "B000F83SZQ",
    reviewerName: "dot",
    helpful: [2, 2],
    reviewText:
      "This was a fairly interesting read.  It had old- style terminology.I was glad to get  to read a story that doesn't have coarse, crasslanguage.  I read for fun and relaxation......I like the free ebooksbecause I can check out a writer and decide if they are intriguing,innovative, and have enough of the command of Englishthat they can convey the story without crude language.",
    overall: 4.0,
    summary: "Oldie",
    unixReviewTime: 1396569600,
    reviewTime: "04 4, 2014",
  },
  {
    reviewerID: "A1FV0SX13TWVXQ",
    asin: "B000F83SZQ",
    reviewerName: 'Elaine H. Turley "Montana Songbird"',
    helpful: [1, 1],
    reviewText:
      "I'd never read any of the Amy Brewster mysteries until this one..  So I am really hooked on them now.",
    overall: 5.0,
    summary: "I really liked it.",
    unixReviewTime: 1392768000,
    reviewTime: "02 19, 2014",
  },
  {
    reviewerID: "A3SPTOKDG7WBLN",
    asin: "B000F83SZQ",
    reviewerName: "Father Dowling Fan",
    helpful: [0, 1],
    reviewText:
      "If you like period pieces - clothing, lingo, you will enjoy this mystery.  Author had me guessing at least 2/3 of the way through.",
    overall: 4.0,
    summary: "Period Mystery",
    unixReviewTime: 1395187200,
    reviewTime: "03 19, 2014",
  },
  {
    reviewerID: "A1RK2OCZDSGC6R",
    asin: "B000F83SZQ",
    reviewerName: "ubavka seirovska",
    helpful: [0, 0],
    reviewText:
      "A beautiful in-depth character description makes it like a fast pacing movie. It is a pity Mr Merwin did not write 30 instead only 3 of the Amy Brewster mysteries.",
    overall: 4.0,
    summary: "Review",
    unixReviewTime: 1401062400,
    reviewTime: "05 26, 2014",
  },
  {
    reviewerID: "A2HSAKHC3IBRE6",
    asin: "B000F83SZQ",
    reviewerName: "Wolfmist",
    helpful: [0, 0],
    reviewText:
      "I enjoyed this one tho I'm not sure why it's called An Amy Brewster Mystery as she's not in it very much. It was clean, well written and the characters well drawn.",
    overall: 4.0,
    summary: "Nice old fashioned story",
    unixReviewTime: 1402358400,
    reviewTime: "06 10, 2014",
  },
];
