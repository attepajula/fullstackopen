const { test, describe } = require('node:test')
const assert = require('node:assert')

const reverse = require('../utils/for_testing').reverse

const listHelper = require('../utils/dummy')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

test('reverse of a', () => {
  const result = reverse('a')

  assert.strictEqual(result, 'a')
})

test('reverse of react', () => {
  const result = reverse('react')

  assert.strictEqual(result, 'tcaer')
})

test('reverse of saippuakauppias', () => {
  const result = reverse('saippuakauppias')

  assert.strictEqual(result, 'saippuakauppias')
})

describe('blog list helpers', () => {
  const blogs = [
    {
      _id: "6782b324fd574dd4750b9d5b",
      title: "Test Blog",
      author: "John Doe",
      url: "http://example.com",
      likes: 5
    },
    {
      _id: "6782ba4a46923ca68730ba15",
      title: "Most Liked Blog",
      author: "Jane Doe",
      url: "http://example.com/popular",
      likes: 12,
      __v: 0
    },
    {
      _id: "6782ba4a46923ca68730ba16",
      title: "Another Blog",
      author: "Joel Doe",
      url: "http://example.com/another",
      likes: 10,
      __v: 0
    },
    {
      _id: "5555ba4a46923ca68730ba16",
      title: "Another Blog",
      author: "Atte",
      url: "http://atte.com/another",
      likes: 10,
      __v: 0
    },
    {
      _id: "5645ba4a46923ca68730ba16",
      title: "And Another Blog",
      author: "Atte",
      url: "http://atte.com/and_another",
      likes: 6,
      __v: 0
    }
  ]

  describe('total likes', () => {
    test('of the provided blogs is 27', () => {
      const result = listHelper.totalLikes(blogs)
      assert.strictEqual(result, 43)
    })
  })

  describe('favorite blog', () => {
    test('is Jane Doe\'s blog', () => {
      const result = listHelper.favoriteBlog(blogs)
      assert.deepStrictEqual(result, {
        title: "Most Liked Blog",
        author: "Jane Doe",
        likes: 12
      })
    })
  })

  describe('most blogs', () => {
    test('returns an author with 1 blog when all have one', () => {
      const result = listHelper.mostBlogs(blogs)
      assert.deepStrictEqual(result, {
        author: "Atte",
        blogs: 2
      })
    })
  })

  describe('most likes', () => {
    test('returns Atte as the most liked author', () => {
      const result = listHelper.mostLikes(blogs)
      assert.deepStrictEqual(result, {
        author: "Atte",
        likes: 16
      })
    })
  })
})