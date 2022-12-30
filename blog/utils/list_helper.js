const { countBy, partial, partialRight } = require('lodash')
var lodash = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.length === 0 ? 
    0 : blogs.reduce((accum, blog) => accum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    return blogs.reduce((a,b)=>a.likes>b.likes?a:b)
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null
    const authorCount = lodash.countBy(blogs, "author")
    const topAuthor = Object.keys(authorCount).reduce((a, b) => {
        return authorCount[a] > authorCount[b] ? a : b;
      })
    console.log(topAuthor)
    return {
        author: topAuthor,
        blogs: authorCount[topAuthor]
    }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) return null;

  const likesCount = lodash(blogs)
    .groupBy("author")
    .map((objs, key) => ({
      author: key,
      likes: lodash.sumBy(objs, "likes"),
    }))
    .value();
    return likesCount.reduce((a, b) => {
        return a.likes > b.likes ? a : b;
      });
}


module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}