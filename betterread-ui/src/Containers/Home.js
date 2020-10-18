import React from 'react';

const Home = () => {
    return (
      <div class="container">

        <h1 class="my-4">BetterRead Book Reviews</h1>

        <form>
          <input type="search"  value="Search for a book" ></input>
        </form>


        <div class="dropdown">
          <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Genres
          </button>
          <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <a class="dropdown-item" href="#">Action</a>
            <a class="dropdown-item" href="#">Another action</a>
            <a class="dropdown-item" href="#">Something else here</a>
          </div>

          <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Reviews
          </button>
          <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <a class="dropdown-item" href="#">Action</a>
            <a class="dropdown-item" href="#">Another action</a>
            <a class="dropdown-item" href="#">Something else here</a>
          </div>

          <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Minimum Rating
          </button>
          <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <a class="dropdown-item" href="#">Action</a>
            <a class="dropdown-item" href="#">Another action</a>
            <a class="dropdown-item" href="#">Something else here</a>
          </div>
        </div>


        <div class="row">

          <div class="col-lg-12 mb-4">
            <div class="card h-100">
              <h4 class="card-header">Book Title</h4>
              <div class="card-body">
                <img src="dinoegg.png" width="200px"></img>
                <a class="card-text">How do i do rows of text in here?</a>
                <a class="card-text">This is my paragraph tag</a>
              </div>
              <div class="class-footer">
                <a href="/add_review" class="btn btn-primary">Add a Review</a>
              </div>
            </div>
          </div>

          <div class="col-lg-12 mb-4">
            <div class="card h-100">
              <h4 class="card-header"> Card Title</h4>
              <div class="card-body">
                <a class="card-text">This is my paragraph tag</a>
              </div>
              <div class="class-footer">
                <a href="/add_review" class="btn btn-primary">Learn More</a>
              </div>
            </div>
          </div>


        </div>
      </div>


    )
}

export default Home
