const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  //Write your code here - Taks 6
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(400).json({message: "User already exists!"});    
    }
  } else {
    return res.status(400).json({message: "Unable to register user"});
  }
});

//-------------------------------------------------------------------------------------------------------
// Get the book list available in the shop - Task 10
public_users.get('/',function (req, res) {
  let GetBookListPromise = new Promise((resolve,reject) => {
    res.status(200).send(JSON.stringify(books,null,4));
    resolve("Response was sent");
  })
  GetBookListPromise.then((successMessage) => {console.log("From Callback -> " + successMessage)})
});

//-------------------------------------------------------------------------------------------------------
// Get book details based on ISBN - Task 11
public_users.get('/isbn/:isbn',function (req, res) {
  let GetBookDetailsPromise = new Promise((resolve,reject) => {
    const isbn = req.params.isbn;
    if (books[isbn]){
      res.status(200).send(books[isbn]);
      resolve("Response was sent");
    } else {
      res.status(400).json({message: "ISBN not found"});
      reject("ISBN not found")
    }
  })
  GetBookDetailsPromise
    .then((successMessage) => {console.log("From Callback -> " + successMessage)})
    .catch((ErrorMessage) => {console.log("From Callback catch -> " + ErrorMessage);}) 
});  

//-------------------------------------------------------------------------------------------------------
// Get book details based on author - Task 12
// Hints:
// 1. Obtain all the keys for the ‘books’ object.
// 2. Iterate through the ‘books’ array & check the author matches the one provided in the request parameters.
public_users.get('/author/:author',function (req, res) {
    let GetBookDetailsByAuthorPromise = new Promise((resolve,reject) => {
        const req_author = req.params.author;
        const bookslist_array = books;
        let authorlist_array = {};
        for(var key in bookslist_array) {
          if(bookslist_array.hasOwnProperty(key)) {
              var value = bookslist_array[key];
              if  (value["author"] == req_author) {
                  authorlist_array[key] = value;
              }}}
        if (!(Object.keys(authorlist_array).length === 0)) {
          res.status(200).send(authorlist_array);
          resolve("The author exists.");
        } else {
          res.status(400).json({message: "The author does not exist."});
          reject("The author does not exist.")}
    })
      GetBookDetailsByAuthorPromise
       .then((successMessage) => {console.log("From Callback -> " + successMessage)})
       .catch((ErrorMessage) => {console.log("From Callback catch -> " + ErrorMessage)});
});

//-------------------------------------------------------------------------------------------------------
// Get all books based on title - Task 13
public_users.get('/title/:title',function (req, res) {
    let GetBookDetailsByTitlePromise = new Promise((resolve,reject) => {
        const req_title = req.params.title;
        const bookslist_array = books;
        let titlelist_array = {};  
        for(var key in bookslist_array) {
            if(bookslist_array.hasOwnProperty(key)) {
              var value = bookslist_array[key];
              if  (value["title"] == req_title) {
                titlelist_array[key] = value;
              }}}
        if (!(Object.keys(titlelist_array).length === 0)) {
          res.status(200).send(titlelist_array);
          resolve("The title exists");
        } else {
          res.status(400).json({message: "The title does not exist."});
          reject("The title does not exist.")}
      })
    GetBookDetailsByTitlePromise
      .then((successMessage) => {console.log("From Callback -> " + successMessage)})
      .catch((ErrorMessage) => {console.log("From Callback catch -> " + ErrorMessage)}); 
    });

//-------------------------------------------------------------------------------------------------------
// Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here - Task 5
  const isbn = req.params.isbn;
  var book = (books[isbn]);
  if (books[isbn]){
    res.status(200).json(book.reviews);
  } else {
    res.status(400).json({message: "Book not found."});
  }
});

module.exports.general = public_users;
