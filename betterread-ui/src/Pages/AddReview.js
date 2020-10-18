import React from 'react';

const AddReview = () => {
    return (
      <div class="container">
        <h3>Add a Review for Book</h3>
        <div class="row">

          <div class="col-sm-4">
          picture of book
          </div>

          <div class="col-sm-8">
          <form>

            <div class="form-group">
              <label>Summary of Book</label>
              <input type="text" class="form-control" id="summary" placeholder="Describe book briefly"/>
            </div>

            <div class="form-group">
              <label>Review</label>
              <input type="text" class="form-control" id="review" placeholder="What are your thoughts on this book?"/>
            </div>

            <button type="submit" class="btn btn-primary">Submit</button>

          </form>
          </div>

        </div>
      </div>
    )
}

export default AddReview
