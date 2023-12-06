const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
let loginUser;

const isValid = (username)=>{ //returns boolean
  //write code to check is the username is valid
  let userswithsamename = users.filter((user)=>{
    return user.username === username
    });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
  //write code to check if username and password match the one we have in records.
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here - Task 7 - Works
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }
  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign( {data: password}, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {accessToken,username}
    loginUser = username;
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here - Task 8
  const isbn = req.params.isbn;
  let filtered_book = books[isbn]
  if (filtered_book) {
    let review = req.query.reviews;
    if (review){
      books[isbn].reviews[loginUser] = req.query.reviews;
      res.send(`Review of user ${loginUser} for the book with isbn ${isbn} has been added or updated.`);
    } else {
      res.send(`Incorrect Review, please enter a correct review.`);
    }
  } else {
    res.send(`The book with isbn ${isbn} does not exists.`);
  }
});

// Delete a book review - Task 9
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let filtered_book = books[isbn]
  if (filtered_book) {
    if(books[isbn].reviews[loginUser]){
      delete books[isbn].reviews[loginUser];
      res.send(`Review of user ${loginUser} for the book with isbn ${isbn} has been deleted.`)
    } else {
      res.send(`Review of user ${loginUser} for the book with isbn ${isbn} does not exist.`)}
  } else {
    res.send(`The book with isbn ${isbn} does not exists.`);
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
