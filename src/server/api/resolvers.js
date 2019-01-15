exports.resolvers = {
  Query: {
    getAllRecipes: async (_root, _args, { Recipe }) => await Recipe.find()
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
    }
  }
}
