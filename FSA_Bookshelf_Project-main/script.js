// !!Book!! 
//This is the constructor function for the Book class. The constructor takes four parameters - author, language, subject, and title. When a new Book object is created, these parameters are used to initialize the properties of the object.
//The properties initialized in the constructor are author, language, subject, title, and an empty array comments. These properties are accessed using the this keyword, which refers to the current instance of the Book class being created.
//The comments array will be used later to store any comments added to the book.
class Book {
  constructor(author, language, subject, title) {
    this.author = author;
    this.language = language;
    this.subject = subject;
    this.title = title;
    this.comments = [];
  }
  
//This is a method of the Book class that creates and returns an HTML form element for adding comments to the book.
//The method first creates a form element, assigns it an id of "comment-form", and sets its innerHTML to a string containing HTML for the form's input fields and submit button. The form has two input fields, one for the commenter's username and another for the comment text, both of which are required. The comment text field has a maximum character limit of 280, and a warning message is displayed if the user types more than 280 characters.
//The method also adds an event listener to the comment text field, which checks the length of the text input and displays the warning message if the character limit is reached.
//The renderCommentForm() method allows the user to add comments to the book and provides a form that ensures the comment is valid before submission.
  renderCommentForm() {
    const form = document.createElement("form");
    form.id = "comment-form";
    form.innerHTML = `
      <label for="username-input">Username:</label>
      <input type="text" id="username-input" name="username-input" required>
      <label for="comment-input">Add a comment:</label>
      <input type="text" id="comment-input" name="comment-input" maxlength="280" required>
      <p id="comment-length-warning" style="color: red; display: none;">Maximum character limit reached.</p>
      <button type="submit" id="submit-comment">OK</button>
    `;
    const commentInput = form.querySelector("#comment-input");
    const commentLengthWarning = form.querySelector("#comment-length-warning");
    commentInput.addEventListener("input", () => {
      if (commentInput.value.length >= 280) {
        commentLengthWarning.style.display = "inline";
      } else {
        commentLengthWarning.style.display = "none";
      }
    });
    return form;
}

//The renderComment method creates and returns an HTML string for a single comment, with the username and text properties of the comment object passed as arguments. The HTML string includes an li element with the comment's username and text, styled with a small font size.
//The renderComments method creates an HTML string for all comments associated with the book instance. It uses the map method to iterate through the array of comments and call the renderComment method for each comment, returning an HTML string with all of the comments enclosed in a ul element.
//The render method creates an HTML string for the entire book instance, including the book's title, author, subject, language, a button to add a comment, a container for the comment form, a container for the comments, and the comments themselves. The renderComments method is called to render the comments. The HTML string is returned as a list item.
  renderComment(comment) {
    return `<li style="font-size:0.8rem"><strong>${comment.username}:</strong> ${comment.text}</li>`;
  }
  
  renderComments() {
    const commentsList = this.comments.map(comment => this.renderComment(comment)).join("");
    return `<ul>${commentsList}</ul>`;
  }

  render() {
    return `
      <li>
        <h2>${this.title}</h2>
        <i>${this.author}</i>
        <br><br>
        <p>${this.subject} (${this.language})</p>
        <button class="add-comment-btn">Add a comment</button>
        <div class="comment-form-container"></div>
        <div class="comments-container">${this.renderComments()}</div>
      </li>
    `;
  }    
}

// !!Bookshelf!!
//This is a class named Bookshelf. It has a constructor that initializes an empty array called books. It also has a method called seed, which accepts an argument called bookData. bookData is an array of objects that contain data about a book (author, language, subject, title).
//Inside the seed method, it loops through each object in bookData and creates a new Book object using the data from the current object. The newly created Book object is then added to the books array. After all objects in bookData have been processed, it calls the render method to display the books on the page.
class Bookshelf {
  constructor() {
    this.books = [];
  }

  seed(bookData) {
    this.books = bookData.map(book => new Book(book.author,book.language,book.subject,book.title));
    this.render();
  }

//This code defines the render method of the Bookshelf class, which is responsible for rendering the book list on the page and handling the event of adding a comment to a book.
//First, the method loops through the array of books in the bookshelf and generates the HTML for each book by calling the render method of the Book class for each book, and concatenates the resulting strings into a single bookList string.
//Then, the method updates the HTML of an element with the ID "Library" with the generated book list.
//Next, the method selects all the elements on the page with the class "add-comment-btn" and loops through them. For each button, it adds a click event listener that retrieves the corresponding book object from the this.books array using the current index of the loop.
//It then finds the comment container element and the comment form container element for the current book by using the nextElementSibling property of the clicked button element. If the comment form container element is empty, it generates a comment form HTML by calling the renderCommentForm method of the corresponding Book object, appends the form to the comment form container element, and adds a submit event listener to the form.
//When the form is submitted, the event listener prevents the default form submission behavior, retrieves the values of the comment input and username input fields, pushes a new comment object to the comments array of the corresponding Book object, generates the new comments HTML by calling the renderComments method of the corresponding Book object, updates the HTML of the comment container element with the new comments HTML, clears the input fields, and clears the comment form container element.
//If the comment form container element is not empty, it clears the comment form container element.

  render() {
    const bookList = this.books.map(book => book.render()).join("");
    document.getElementById("Library").innerHTML = `<ol>${bookList}</ol>`;

    const addCommentBtns = document.getElementsByClassName("add-comment-btn");
    for (let i = 0; i < addCommentBtns.length; i++) {
      const addCommentBtn = addCommentBtns[i];
      addCommentBtn.addEventListener("click", () => {
        const book = this.books[i];
        const commentsContainer = addCommentBtn.nextElementSibling.nextElementSibling;
        const commentFormContainer = addCommentBtn.nextElementSibling;
        const form = book.renderCommentForm();

        if (commentFormContainer.innerHTML === "") {
          commentFormContainer.appendChild(form);

          form.addEventListener("submit", (event) => {
            event.preventDefault();
            const commentInput = form.querySelector("#comment-input");
            const usernameInput = form.querySelector("#username-input");
            const comment = commentInput.value;
            const username = usernameInput.value;

            if (comment !== "") {
              book.comments.push({ text: comment, username: username });
              commentsContainer.innerHTML = book.renderComments();
              commentInput.value = "";
              usernameInput.value = "";
              commentFormContainer.innerHTML = "";
            }
          });
        } else {
          commentFormContainer.innerHTML = "";
        }
      });
    }
  }

// Creates a new instance of the Bookshelf class and assigns it to the bookLibrary variable. It then calls the seed method of the bookLibrary object, passing in the bookData array as an argument. The seed method creates new instances of the Book class for each object in the bookData array, and adds them to the books array of the bookLibrary object. Finally, it calls the render method of the bookLibrary object to display the list of books on the web page.
  addBook(book) {
    this.books.push(book);
    this.render();
    alert("Book added!");
  }
}

const bookLibrary = new Bookshelf();
bookLibrary.seed(bookData);


// !!Add books!!
// Defines an event listener function called handleAddBook which will be called when the form with id add-book-form is submitted. When the form is submitted, the function retrieves the values of the input fields for title, author, subject and language, and creates a new book object using the Book constructor. The new book object is then passed to the addBook method of the bookLibrary object, which adds it to the array of books and re-renders the bookshelf to display the new book.
function handleAddBook(event) {
  event.preventDefault();

  const title = document.getElementById("title-input").value;
  const author = document.getElementById("author-input").value;
  const subject = document.getElementById("subject-input").value;
  const language = document.getElementById("language-input").value;

  const book = new Book(author, language, subject, title);
  bookLibrary.addBook(book);
  
}

const addBookForm = document.getElementById("add-book-form");
addBookForm.addEventListener("submit", handleAddBook);

function handleAddBook(event) {
  event.preventDefault();

  const title = document.getElementById("title-input").value;
  const author = document.getElementById("author-input").value;
  const subject = document.getElementById("subject-input").value;
  const language = document.getElementById("language-input").value;

  const book = new Book(author, language, subject, title);
  bookLibrary.addBook(book);

}