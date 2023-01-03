const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
   const blogs = await Blog.find({});
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
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })
  
  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
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