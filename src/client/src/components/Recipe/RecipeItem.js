import React from 'react'
import { Link } from 'react-router-dom'

const RecipeItem = ({ recipe }) => {
  return (
    <div>
      <Link to={`/recipe/${recipe._id}`}>
        <h4>{recipe.name}</h4>
      </Link>
      <p>
        <strong>{recipe.category}</strong>
      </p>
    </div>
  )
}

export default RecipeItem
