const { test, after, beforeEach } = require("node:test");
const helper = require("./test_helper");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const assert = require("assert");
const Blog = require("../models/blog");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  for (const blog of helper.initialBlogs) {
    const blogObj = new Blog(blog);
    await blogObj.save();
  }
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("correct number of blogs are returned", async () => {
  const response = await api.get("/api/blogs");
  assert.strictEqual(response.body.length, helper.initialBlogs.length);
});

test("a specific blog is within the returned blogs", async () => {
  const response = await api.get("/api/blogs");

  const titles = response.body.map((e) => e.title);

  assert(titles.includes("Browser can execute only JavaScript"));
});

test("a valid blog can be added ", async () => {
  const newBlog = {
    title: "new blog",
    author: "new author",
    url: "https://newblog.com",
    likes: 9,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

  const titles = blogsAtEnd.map((r) => r.title);
  assert(titles.includes("new blog"));
});

test("blog without title is not added", async () => {
  const newBlog = {
    author: "new author 1",
    url: "https://newblog1.com",
    likes: 11,
  };

  await api.post("/api/blogs").send(newBlog).expect(400);

  const blogsAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
});

test("blog without url is not added", async () => {
  const newBlog = {
    title: "new blog",
    author: "new author 1",
    likes: 11,
  };

  await api.post("/api/blogs").send(newBlog).expect(400);

  const blogsAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
});

test("a specific blog can be viewed", async () => {
  const blogsAtStart = await helper.blogsInDb();

  const blogToView = blogsAtStart[0];

  const resultBlog = await api
    .get(`/api/blogs/${blogToView.id}`)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  assert.deepStrictEqual(resultBlog.body, blogToView);
});

test("a blog can be deleted", async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToDelete = blogsAtStart[0];

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

  const blogsAtEnd = await helper.blogsInDb();

  const titles = blogsAtEnd.map((r) => r.title);
  assert(!titles.includes(blogToDelete.title));

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);
});

test("blogs have id property instead of _id", async () => {
  const response = await api.get("/api/blogs");
  const blogs = response.body;

  blogs.forEach(blog => {
    assert(blog.id);
    assert(!blog._id);
  });
});

test('add a blog with zero likes if the likes property is missing', async () => {
  const newBlog = {
    title: "new blog",
    author: "new author 1",
    url: "https://newblog.com"
  };

  const blogsAtStart = await helper.blogsInDb()
  const response = await api.post('/api/blogs').send(newBlog)
  const addedBlog = response.body
  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(addedBlog.likes, 0);
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1);
})

after(async () => {
  await mongoose.connection.close();
});
