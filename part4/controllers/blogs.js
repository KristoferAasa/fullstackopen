const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

blogsRouter.post("/", async (request, response) => {
  const body = request.body;

  if (!body.likes) {
    body.likes = 0;
  }

  const blog = new Blog(request.body);

  if (!blog.title || !blog.url) return response.status(400).end();

  const savedBlog = await blog.save();
  response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const id = request.params.id;
  const blog = request.body;

  if (!blog.title || !blog.author || !blog.url) {
    return response.status(400).end();
  }

  const updatedBlog = await Blog.findByIdAndUpdate(id, blog, { new: true });

  updatedBlog ? response.json(updatedBlog) : response.status(404).end();
});

module.exports = blogsRouter;
