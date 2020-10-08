import React from "react";
import { Navbar, Nav } from "react-bootstrap";

const TopNavBar = () => {
  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Navbar.Brand href="/">BetterRead</Navbar.Brand>
      <Nav className="ml-auto">
        <Nav.Link href="/add_book" color="primary">
          Add Book
        </Nav.Link>
        <Nav.Link href="/add_review">Add Review</Nav.Link>
      </Nav>
    </Navbar>
  );
};

export default TopNavBar;
