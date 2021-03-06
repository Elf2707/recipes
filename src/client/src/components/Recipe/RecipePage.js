import React from 'react'
import { withRouter } from 'react-router-dom'
import { Query } from 'react-apollo'

import { GET_RECIPE } from '../../queries'
import LikeRecipe from './LikeRecipe'

const RecipePage = ({ match }) => {
  const { _id } = match.params

  return (
    <Query query={GET_RECIPE} variables={{ _id }}>
      {({ data, loading, error }) => {
        if (loading) return <div>Loading</div>
        if (error) return <div>Error</div>

        const { getRecipe: recipe } = data

        return (
          <div className="App">
            <h2>{recipe.name}</h2>
            <p>Category: {recipe.category}</p>
            <p>Description: {recipe.description}</p>
            <p>Instructions: {recipe.instructions}</p>
            <p>Likes: {recipe.likes}</p>
            <p>Created By: {recipe.username}</p>
            <LikeRecipe _id={recipe._id} />
          </div>
        )
      }}
    </Query>
  )
}

export default withRouter(RecipePage)
