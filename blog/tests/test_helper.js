const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: "A Day In Winter",
        author: "Brian Lin",
        url: "blogs.com",
        likes: 0
    },
    {
        title: "A Day In Fall",
        author: "Brian Lin",
        url: "blogs.com",
        likes: 0
    },
  ]

const blogsInDB = async () => {
    const blogs = await Blog.find({});
    console.log(blogs)
    return blogs.map(blog => blog.toJSON());
}

  module.exports = { initialBlogs, blogsInDB }