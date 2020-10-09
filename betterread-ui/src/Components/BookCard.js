import React from "react";
import "./BookCard.css";
import { Card, Button } from "react-bootstrap";

const BookCard = (props) => {
  console.log(props.bookDetails)
  const { title, subtitle, author, ratings, numOfReviews } = props.bookDetails;

  return (
    <div className="card-container">
      <span
        style={{ width: "200px", height: "250px", backgroundColor: "skyblue" }}
      ></span>
      <Card.Body>
        <Card.Title as="h2" className="book-title">
          {title}
        </Card.Title>
        <Button
          variant="outline-primary"
          className="add-review-btn"
          href="/add_review"
        >
          Add review
        </Button>
        <Card.Subtitle className="mb-2 text-muted">{subtitle}</Card.Subtitle>
        <Card.Text className="mb-2 text-muted">{`by ${author}`}</Card.Text>
        <div>Ratings: {ratings}</div>
        <Card.Link href="/view_review" className="view-review-link">
          View Reviews ({numOfReviews})
        </Card.Link>
      </Card.Body>
    </div>
  );
};

export default BookCard;
