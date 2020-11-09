import React from "react";
import "./BookCard.css";
import { Card, Row } from "react-bootstrap";
import Category from "./Category";

const BookCard = (props) => {
  const {
    title,
    author,
    ratings,
    imgSrc,
    numOfReviews,
    categories,
  } = props.bookDetails;



  return (
    <div className="card-container">
      <img
        src={imgSrc}
        alt={title}
        style={{
          width: "200px",
          height: "250px",
          objectFit: "cover",
        }}
      />
      <Card.Body>
        <Row>
          <Card.Title as="h4" className="book-title">
            {title}
          </Card.Title>
        </Row>
        <Row>
          <Card.Text className="mb-2 text-muted">{`by ${author}`}</Card.Text>
        </Row>
        <div>Ratings: {ratings}</div>
        <Card.Text className="mb-2">Category:</Card.Text>
        <div>
          {categories.map((c) => (
            <Category category={c} key={c} />
          ))}
        </div>
        <Row>
          <Card.Link href="/review" className="view-review-link">
            View Reviews ({numOfReviews})
          </Card.Link>
        </Row>
      </Card.Body>
    </div>
  );
};

export default BookCard;
