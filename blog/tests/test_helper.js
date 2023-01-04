const Blog = require('../models/blog')
const User = require('../models/user')

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
    return blogs.map(blog => blog.toJSON());
}

const usersInDB = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

  module.exports = { initialBlogs, blogsInDB, usersInDB }