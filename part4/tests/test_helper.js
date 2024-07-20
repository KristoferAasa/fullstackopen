const Blog = require("../models/blog");

const initialBlogs = [
  {
    title: "HTML is easy",
    author: "person1",
    url: "example.com",
    likes: 5,
  },
  {
    title: "Browser can execute only JavaScript",
    author: "person2",
    url: "example.com",
    likes: 10,
  },
];

const nonExistingId = async () => {
  const blog = new Blog({
    title: "willremovethissoon",
    author: "willremovethissoon",
    url: "willremovethissoon",
    likes: 100,
  });
  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
};
