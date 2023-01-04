const blogsRouter = require('express').Router()
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
   const blogs = await Blog.find({}).populate('user', { username: 1, name: 1});
   response.json(blogs);
})
  
blogsRouter.get('/:id', async (request, response) => {
  const foundBlog = await Blog.findById(request.params.id)
  if (foundBlog) {
    response.json(foundBlog)
  } else {
    response.status(404).end()
  }
})
  
blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const user = request.user;
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({error: 'token missing or invalid' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })
  
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const token = request.token;
  const user = request.user;
  const decodedToken = jwt.verify(token, process.env.SECRET);

  if (!(token && decodedToken.id)) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  const id = request.params.id;
  const blog = await Blog.findById(id);
  if (blog.user.toString() === user._id.toString()) {
    await Blog.deleteOne({ _id: id });
    response.sendStatus(204).end();
  } else {
    response.status(401).json({ error: "unauthorized operation" });
  }
})

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body
  
    const note = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }
    const updated = await Blog.findByIdAndUpdate(request.params.id, note, { new: true });
    if (updated) {
      response.json(updated)
    } else {
      response.status(404).end()
    }
})

module.exports = blogsRouter