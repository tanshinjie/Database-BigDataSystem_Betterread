const express = require('express')
const router = express.Router()

router.use((req,res,next)=>{
    console.log('Logging request to MongoDB')
    next()
})

router.get('/',(req,res)=>{
    // TODO: MySQL query to get all books 
    res.send('Getting all books from MySQL')
})

router.get('/book/:id',(req,res)=>{
    // TODO: Get reviews of book with id from MySQL
    res.send('Get list of reviews of book with ID from MySQL '+ req.params.id)
})

router.post('/add_book',(req,res)=>{
    const {author, title} = req.body
    console.log(author,title)
    // TODO: Add book to mongoDB
    res.send('Add book to MongoDB')
})

router.post('/add_review',(req,res)=>{
    const {summary, review} = req.body
    console.log(summary,review)
    // TODO: Add review of a book to MySQL
    res.send('Add review to MySQL database')
})

module.exports = router;