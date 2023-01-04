const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app/app')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(helper.initialBlogs[0])
    await blogObject.save()
    noteObject = new Blog(helper.initialBlogs[1])
    await noteObject.save()
})

test('notes are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 100000)

test('there is two blog', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('one of the blogs is about Fall', async () => {
    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)
    expect(titles).toContain('A Day In Fall')
})

test('a valid blog can be added', async () => {
    const newBlog = {
        title: "A Day In Heaven",
        author: "Brian Lin",
        url: "blogs.com",
        likes: 0
    }
    await api.post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)
    expect(titles).toContain('A Day In Heaven')
    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
})

test('blog without title can\'t be added', async () => {
    const newBlog = {
        author: "Brian Lin",
        url: "blogs.com",
        likes: 0
    }
    await api.post('/api/blogs')
    .send(newBlog)
    .expect(400)
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('verify id property', async () => {
    const response = await api.get('/api/blogs')
    const firstBlog = response.body[0]
    expect(firstBlog.id).toBeDefined()
})

test('verify default value of 0 likes', async () => {
    const newBlog = {
        title: "A Day In Hell",
        author: "Brian Lin",
        url: "blogs.com",
    }
    await api.post('/api/blogs')
    .send(newBlog)
    .expect(201)
    const response = await api.get('/api/blogs')
    console.log(response.body[2])
    expect(response.body[2].likes).toBe(0);
})

test('delete a blog', async () => {
    const blogs = await helper.blogsInDB()
    const blogToDelete = blogs[0]
    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

    const response = await helper.blogsInDB()
    expect(response).toHaveLength(helper.initialBlogs.length - 1)
    expect(response).not.toContain(blogToDelete.title)
})

test('update blog is possible', async () => {
    let blogs = await helper.blogsInDB()
    const blogToUpdate = blogs[0]
    const updated = {likes:10}
    console.log(updated)
    await api.put(`/api/blogs/${blogToUpdate.id}`).send(updated)
    
    blogs = await helper.blogsInDB()
    expect(blogs[0].likes).toBe(10)
})

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
      await User.deleteMany({})
  
      const passwordHash = await bcrypt.hash('sekret', 10)
      const user = new User({ username: 'root', passwordHash })
  
      await user.save()
    })
  
    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDB()
  
      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
      }
  
      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await helper.usersInDB()
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
  
      const usernames = usersAtEnd.map(u => u.username)
      expect(usernames).toContain(newUser.username)
    })
  })


afterAll(() => {
    mongoose.connection.close()
})