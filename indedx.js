const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

const BlogAPI = {
  posts: [],

  // Method to create a new blog post
  createPost: function (title, content, author) {
    const newPost = {
      id: this.posts.length + 1,
      title: title,
      content: content,
      author: author,
      createdAt: new Date().toISOString(),
      updatedAt: null,
    };
    this.posts.push(newPost);
    return newPost;
  },

  // Method to retrieve all blog posts
  getAllPosts: function () {
    return this.posts;
  },

  // Method to retrieve a specific blog post by ID
  getPostById: function (id) {
    return this.posts.find((post) => post.id === id);
  },

  // Method to update a blog post
  updatePost: function (id, updatedTitle, updatedContent) {
    const postToUpdate = this.getPostById(id);
    if (postToUpdate) {
      postToUpdate.title = updatedTitle;
      postToUpdate.content = updatedContent;
      postToUpdate.updatedAt = new Date().toISOString();
      return postToUpdate;
    } else {
      return null; // Post not found
    }
  },

  // Method to delete a blog post
  deletePost: function (id) {
    const index = this.posts.findIndex((post) => post.id === id);
    if (index !== -1) {
      this.posts.splice(index, 1);
      return true; // Post deleted successfully
    } else {
      return false; // Post not found
    }
  },

  // Method to sort blog posts by publication date or author name
  sortPosts: function (field) {
    return this.posts.slice().sort((a, b) => {
      if (field === "createdAt") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (field === "author") {
        return a.author.localeCompare(b.author);
      }
    });
  },

  // Method to filter posts by author
  filterPostsByAuthor: function (authorName) {
    return this.posts.filter((post) => post.author === authorName);
  },
};

// Route to create a new blog post
app.post("/posts", (req, res) => {
  const { title, content, author } = req.body;
  const newPost = BlogAPI.createPost(title, content, author);
  res.json(newPost);
});

// Route to get all blog posts with sorting and filtering options
app.get("/posts", (req, res) => {
  let posts = BlogAPI.getAllPosts();

  // Sorting
  const { sortBy } = req.query;
  if (sortBy) {
    posts = BlogAPI.sortPosts(sortBy);
  }

  // Filtering by author
  const { author } = req.query;
  if (author) {
    posts = BlogAPI.filterPostsByAuthor(author);
  }

  res.json(posts);
});

// Route to get a specific blog post by ID
app.get("/posts/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  const post = BlogAPI.getPostById(postId);
  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ message: "Post not found" });
  }
});

// Route to update a blog post
app.put("/posts/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  const { title, content } = req.body;
  const updatedPost = BlogAPI.updatePost(postId, title, content);
  if (updatedPost) {
    res.json(updatedPost);
  } else {
    res.status(404).json({ message: "Post not found" });
  }
});

// Route to delete a blog post
app.delete("/posts/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  const deleted = BlogAPI.deletePost(postId);
  if (deleted) {
    res.json({ message: "Post deleted successfully" });
  } else {
    res.status(404).json({ message: "Post not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
