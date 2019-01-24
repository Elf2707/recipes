import React from 'react'
import { Query, Mutation } from 'react-apollo'
import { Link } from 'react-router-dom'

import {
  GET_USER_RECIPES,
  DELETE_USER_RECIPE,
  GET_ALL_RECIPES,
  GET_CURRENT_USER
} from '../../queries'

function handleDeleteRecipe(deleteUserRecipe) {
  const confirm = window.confirm('Are you sure you want to delete recipe?')
  if (confirm) {
    deleteUserRecipe().then(({ data }) => {
      console.log(data)
    })
  }
}

const UserRecipes = ({ username }) => {
  return (
    <Query query={GET_USER_RECIPES} variables={{ username }}>
      {({ data, loading, error }) => {
        if (loading) return <div>Loading...</div>
        if (error) return <div>{error.message}</div>

        return (
          <ul className="App">
            <h3>Your Recipes</h3>
            {data.getUserRecipes.map(recipe => (
              <li key={recipe._id}>
                <Link to={`/recipe/${recipe._id}`}>
                  <p>{recipe.name}</p>
                </Link>
                <p>Likes: {recipe.likes}</p>

                <Mutation
                  mutation={DELETE_USER_RECIPE}
                  variables={{ _id: recipe._id }}
                  update={(cache, { data: { deleteUserRecipe } }) => {
                    const { getUserRecipes } = cache.readQuery({
                      query: GET_USER_RECIPES,
                      variables: { username }
                    })

                    cache.writeQuery({
                      query: GET_USER_RECIPES,
                      variables: { username },
                      data: {
                        getUserRecipes: getUserRecipes.filter(
                          r => r._id !== deleteUserRecipe._id
                        )
                      }
                    })
                  }}
                  refetchQueries={() => [
                    { query: GET_ALL_RECIPES },
                    { query: GET_CURRENT_USER }
                  ]}
                >
                  {(deleteUserRecipe, attrs = {}) => (
                    <p
                      className="delete-button"
                      onClick={() => handleDeleteRecipe(deleteUserRecipe)}
                    >
                      {attrs.loading ? 'deleting...' : 'X'}
                    </p>
                  )}
                </Mutation>
              </li>
            ))}
          </ul>
        )
      }}
    </Query>
  )
}

export default UserRecipes
