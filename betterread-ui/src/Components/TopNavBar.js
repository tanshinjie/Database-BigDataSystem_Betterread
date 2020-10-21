import React from "react";
import { Navbar, Nav } from "react-bootstrap";

const TopNavBar = () => {
  return (
    <Navbar bg="primary" variant="dark" expand="lg" style={{ height: "80px" }}>
      <Navbar.Brand href="/">BetterRead</Navbar.Brand>
      <Nav className="ml-auto">
        <Nav.Link href="/addbook" color="primary">
          Add Book
        </Nav.Link>
        <Nav.Link href="/addreview">Add Review</Nav.Link>
      </Nav>
    </Navbar>
  );
};

export default TopNavBar;
