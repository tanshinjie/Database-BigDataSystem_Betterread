import React from "react";

const AddBook = () => {
  return (
    <div class="container">
      <h3>Add a New Book</h3>
      <form>
        <div class="row">
          <div class="col-sm-6">
            <div class="form-group">
              <input
                type="text"
                class="form-control"
                id="titleofbook"
                placeholder="Title of Book"
              />
            </div>
            <div class="form-group">
              <input
                type="text"
                class="form-control"
                id="nameofauthor"
                placeholder="Name of Author"
              />
            </div>
            <button type="submit" class="btn btn-primary">
              Add Book
            </button>
          </div>

          <div class="col-sm-6">
            Note:
            <br />
            BetterReads has over 12 million books in its database already, so
            please do a search before adding a book, as it may be a duplicate.
            <br />
            <br />
            Guidelines:
            <br />
            Title:
            <br />
            If the book is in a series, put which book it is in parenthesis
            after the title.
            <br />
            <br />
            Author:
            <br />
            Add author in the order they are listed on the book cover. <br />
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddBook;
