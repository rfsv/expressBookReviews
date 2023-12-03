const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here - Taks 6 - Works
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } else {
    return res.status(404).json({message: "Unable to register user"});
  }
});

//-------------------------------------------------------------------------------------------------------
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here - Task 10 - 
  let GetBookListPromise = new Promise((resolve,reject) => {
    console.log("Inside PROMISE Function."); //del
    res.send(JSON.stringify(books,null,4))
    resolve("Response was sent"); //del
  })
  console.log("Promise implemented");
  GetBookListPromise.then((successMessage) => {console.log("From Callback -> " + successMessage)})
});

//-------------------------------------------------------------------------------------------------------
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here - Task 11 -
  let GetBookDetailsPromise = new Promise((resolve,reject) => {
    console.log("Inside PROMISE Function.");
    const isbn = req.params.isbn;
    if (books[isbn]){
      res.send(books[isbn]);
      resolve("Response was sent");
    } else {
      res.send("ISBN not found");
      reject("ISBN not found")
    }
  })
  GetBookDetailsPromise
    .then((successMessage) => {console.log("From Callback -> " + successMessage)})
    .catch((ErrorMessage) => {console.log("From Callback catch -> " + ErrorMessage);}) 
});  

//-------------------------------------------------------------------------------------------------------
// Get book details based on author
// Hints:
// 1. Obtain all the keys for the ‘books’ object.
// 2. Iterate through the ‘books’ array & check the author matches the one provided in the request parameters.
public_users.get('/author/:author',function (req, res) {
    //Write your code here - Task 12
    let GetBookDetailsByAuthorPromise = new Promise((resolve,reject) => {
        const req_author = req.params.author;
        bookslist_array = books;
        authorlist_array = {};
        for(var key in bookslist_array) {
          if(bookslist_array.hasOwnProperty(key)) {
              var value = bookslist_array[key];
              if  (value["author"] == req_author) {
                  authorlist_array[key] = value;
              }
            }  
        }
        //if (authorlist_array){
        if (!(Object.keys(authorlist_array).length === 0)) {
          console.log("The Author exists");
          res.send(authorlist_array);
          resolve("The author exists.");
        } else {
          console.log("Author does not exist");
          res.send("The author does not exist.") 
          reject("The author does not exist.")
        }
      })
      GetBookDetailsByAuthorPromise
       .then((successMessage) => {console.log("From Callback -> " + successMessage)})
       .catch((ErrorMessage) => {console.log("From Callback catch -> " + ErrorMessage)});
});

//-------------------------------------------------------------------------------------------------------
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    //Write your code here - Task 13
    let GetBookDetailsByTitlePromise = new Promise((resolve,reject) => {
        const req_title = req.params.title;
        bookslist_array = books;
        titlelist_array = {};  
        for(var key in bookslist_array) {
            if(bookslist_array.hasOwnProperty(key)) {
              var value = bookslist_array[key];
              if  (value["title"] == req_title) {
                titlelist_array[key] = value;
              }
            }
        }
        if (!(Object.keys(titlelist_array).length === 0)) {
          console.log("The Title exists");
          res.send(titlelist_array);
          resolve("The title exists");
        } else {
          console.log("Title does not exist");
          res.send("The title does not exist.") 
          reject("The title does not exist.")
        }
      })
      GetBookDetailsByTitlePromise
        .then((successMessage) => {console.log("From Callback -> " + successMessage)})
        .catch((ErrorMessage) => {console.log("From Callback catch -> " + ErrorMessage)}); 
    });

//-------------------------------------------------------------------------------------------------------
// Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here - Task 5 - Works
  const isbn = req.params.isbn;
  var book = (books[isbn]);
  if (books[isbn]){
    res.send(book.reviews);
    //return res.status(200).json(books[isbn].reviews);
  } else {
    res.send("Book not found");
  }
});

module.exports.general = public_users;
