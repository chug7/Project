const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const auth = require('../../middleware/auth')
//to get name avatar and the user itself we must import these models
const Post = require('../../models/Post')
const Profile = require('../../models/Profile')
const User = require('../../models/User')

// @route  POST api/posts
// @desc   Create a post
//@access  Private (cause you need to be logged in to post)

router.post(
  '/',
  [auth, [check('text', 'Text is required').notEmpty()]], //avatar is from user id from token to get that and that will not be sent
  async (req, res) => {
    const errors = validationResult(req) //vR takes in the request

    if (!errors.isEmpty()) {
      //no errors is empty means there is errors
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      //user name and avatar are coming from the database we are not sending it with the request
      const user = await User.findById(req.user.id).select('-password') // - note we dont want the password back so we put in -passowrd
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      })
      const post = await newPost.save()
      res.json(post)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error')
    }
  },
)

// @route  GET api/posts
// @desc   Get all posts
//@access  Private

router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 })
    res.json(posts)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// @route  GET api/posts/:id
// @desc   Get post by id
//@access  Private

router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' })
    }

    res.json(post)
  } catch (err) {
    console.error(err.message)
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' })
    }
    res.status(500).send('Server Error')
  }
})

// @route  DELETE api/posts/:id
// @desc   delete a post
//@access  Private

router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' })
    }

    //make sure the user thats deleting the post is the user that owns the post
    //check the person who made the post is the logged in user (which is req.user.id):
    //but req.user.id is a string. and  post.user is an object so for it to match the object must be changed into a string

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' })
    }
    await post.remove()

    res.json({ msg: 'Post removed' })
  } catch (err) {
    console.error(err.message)

    if (err.kind === 'ObjectId') {
      // if the objectid is not correct return this error
      return res.status(404).json({ msg: 'Post not found' })
    }

    res.status(500).send('Server Error')
  }
})

// @route  PUT api/posts/like/:id  -> we need to know the id of the post that's being liked
// @desc   like a post
//@access  Private

router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    //check if the post has already been liked by this user, filter through the likes array
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: 'Post already liked' })
    }
    post.likes.unshift({ user: req.user.id }) // it just added it to the post object, but we have to actually save it back to the database
    await post.save()
    res.json(post.likes) //it will return the user and the id of the like.
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// @route  PUT api/posts/unlike/:id  -> we need to know the id of the post that's being liked
// @desc   like a post
//@access  Private

router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    //we can only dislike a post if we've liked it before.
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0 //means we havent liked it yet.
    ) {
      return res.status(400).json({ msg: 'Post has not yet been liked' })
    }
    //Get remove index: map - for each like, return like.user (since the like array has the user)
    // but we convert to string. then chain on "index of" to get the index by passing in the req.user.id.
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id)

    //now get the correct like and splice it out of the like array
    post.likes.splice(removeIndex, 1)

    await post.save()
    res.json(post.likes)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// @route  POST api/posts/comment/:id
// @desc   Comment on a post
//@access  Private (cause you need to be logged in to post)

router.post(
  '/comment/:id',
  [auth, [check('text', 'Text is required').notEmpty()]],
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const user = await User.findById(req.user.id).select('-password')
      const post = await Post.findById(req.params.id)

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      }

      post.comments.unshift(newComment)

      await post.save()
      res.json(post.comments)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error')
    }
  },
)

// @route  DELETE api/posts/comment/:id/:comment_id
// @desc   delete comment
// @access  Private (cause you need to be logged in to post)

router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    //pull out comment
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id,
    )
    //Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist' })
    }
    //Make sure the user that deletes the comment actually made the comment
    //check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' })
    }

    //Get remove index
    const removeIndex = post.comments
      .map((comment) => comment.id) //new array with comment with id together
      .indexOf(req.params.comment_id) //index of the comment in the url
    //You're mapping a new array with their ids only, then on this array you're calling a method
    //indexOf to find the id which is in the URL (req.params.comment_id). indexOf gets the index of the item inside the parenthsis

    //now get the correct comment and splice it out of the comments array
    post.comments.splice(removeIndex, 1)

    await post.save()
    res.json(post.comments) // return all the comments
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

module.exports = router
