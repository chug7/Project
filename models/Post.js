const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users', //reference the user's model (so user can only delete their own posts etc and show their avatar etc)
  },
  text: {
    type: String,
    required: true,
  },
  name: {
    //the name of the user (if a user deletes their post - give them an option to not delete their posts. Keept the name avatar = show the user in the post without having to dig into the user collection    )
    type: String,
  },
  avatar: {
    type: String,
  },
  likes: [
    //the likes array will be an array of user objects that will have the user IDs
    //from the user ObjectId
    {
      user: {
        //to know which likes came from which user
        type: Schema.Types.ObjectId,
        ref: 'users',
        //to enable users to only like once.
      },
    },
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
      },
      text: {
        //every comment needs a text
        type: String,
        required: true,
      },
      name: {
        //the name of the user (if a user deletes their post - give them an option to not delete their posts. Keept the name avatar = show the user in the post without having to dig into the user collection    )
        type: String,
      },
      avatar: {
        type: String,
      },
      date: {
        //the date of the comment
        type: Date,
        default: Date.now, //default will be the current date
      },
    },
  ],
  date: {
    // date on the actual post itself
    type: Date,
    default: Date.now,
  },
})

module.exports = Post = mongoose.model('post', PostSchema)
