import React from "react";

const AddBook = () => {
  return (
    <div class="container">

      <h3>Add a New Book</h3>

      <form>
      <div class="row">

        <div class="col-sm-6">
          <div class="form-group">
            <input type="text" class="form-control" id="titleofbook" placeholder="Title of Book"/>
          </div>
          <div class="form-group">
            <input type="text" class="form-control" id="nameofauthor" placeholder="Name of Author"/>
          </div>
          <button type="submit" class="btn btn-primary">Add Book</button>
        </div>

        <div class="col-sm-6">
          Note: asiovneaovne Shinjie you got the text for notes please copy and paste here thankyouuu! :)
        </div>

      </div>
      </form>

    </div>


  );
};

export default AddBook;
