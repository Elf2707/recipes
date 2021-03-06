const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const createToken = (user, secret, expiresIn) => {
  const { username, email } = user
  return jwt.sign({ username, email }, secret, { expiresIn })
}

exports.resolvers = {
  Query: {
    getAllRecipes: async (_root, _args, { Recipe }) =>
      await Recipe.find().sort({ createdDate: 'desc' }),

    searchRecipes: async (_root, { searchTerm }, { Recipe }) => {
      if (searchTerm) {
        return Recipe.find(
          { $text: { $search: searchTerm } },
          {
            score: { $meta: 'textScore' }
          }
        ).sort({ score: { $meta: 'textScore' } })
      } else {
        return await Recipe.find().sort({ likes: 'desc', createdDate: 'desc' })
      }
    },

    getRecipe: async (_root, { _id }, { Recipe }) =>
      await Recipe.findOne({ _id }),

    getUserRecipes: async (_root, { username }, { Recipe }) =>
      await Recipe.find({ username }).sort({ createdDate: 'desc' }),

    getCurrentUser: async (_root, _args, { currentUser, User }) => {
      if (!currentUser) return null

      const user = await User.findOne({
        username: currentUser.username
      }).populate({
        path: 'favorites',
        model: 'Recipe'
      })

      return user
    }
  },
  Mutation: {
    addRecipe: async (
      _root,
      { name, description, category, instructions, username },
      { Recipe }
    ) => {
      const newRecipe = await new Recipe({
        name,
        description,
        category,
        instructions,
        username
      }).save()

      return newRecipe
    },

    deleteUserRecipe: async (_root, { _id }, { Recipe }) =>
      await Recipe.findOneAndRemove({ _id }),

    signinUser: async (root, { username, password }, { User }) => {
      const user = await User.findOne({ username })
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw Error('Wrong credentials')
      }

      return { token: createToken(user, process.env.SECRET, '1hr') }
    },

    signupUser: async (root, { username, email, password }, { User }) => {
      const user = await User.findOne({ username })
      if (user) throw new Error('User already exists')

      const newUser = await new User({
        username,
        email,
        password
      }).save()

      return { token: createToken(newUser, process.env.SECRET, '1hr') }
    },

    likeRecipe: async (_root, { _id, username }, { Recipe, User }) => {
      const recipe = await Recipe.findOneAndUpdate(
        { _id },
        { $inc: { likes: 1 } }
      )
      await User.findOneAndUpdate(
        { username },
        { $addToSet: { favorites: _id } }
      )

      return recipe
    },

    unlikeRecipe: async (_root, { _id, username }, { Recipe, User }) => {
      const recipe = await Recipe.findOneAndUpdate(
        { _id },
        { $inc: { likes: -1 } }
      )
      await User.findOneAndUpdate({ username }, { $pull: { favorites: _id } })

      return recipe
    }
  }
}
