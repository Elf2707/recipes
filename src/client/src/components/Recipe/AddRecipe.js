import React from 'react'
import { Mutation } from 'react-apollo'
import { withRouter } from 'react-router-dom'

import { ADD_RECIPE, GET_ALL_RECIPES, GET_USER_RECIPES } from '../../queries'
import Error from '../Error'
import withAuth from '../withAuth'

const initState = {
  name: '',
  category: 'Breakfast',
  description: '',
  instructions: '',
  username: ''
}

class AddRecipe extends React.Component {
  state = { ...initState }

  componentDidMount() {
    const { session } = this.props

    if (session && session.getCurrentUser) {
      this.setState({ username: session.getCurrentUser.username })
    }
  }

  validateForm() {
    const { name, category, description, instructions } = this.state
    return !name || !category || !description || !instructions
  }

  updateCache(
    cache,
    {
      data: { addRecipe }
    }
  ) {
    const { getAllRecipes } = cache.readQuery({ query: GET_ALL_RECIPES })
    cache.writeQuery({
      query: GET_ALL_RECIPES,
      data: {
        getAllRecipes: [addRecipe, ...getAllRecipes]
      }
    })
  }

  handleChange = e => {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }

  handleSubmit(ev, addRecipe) {
    ev.preventDefault()
    addRecipe().then(({ data }) => {
      console.log(data)
      this.props.history.push('/')
    })
  }

  render() {
    const { name, category, description, instructions, username } = this.state

    return (
      <Mutation
        mutation={ADD_RECIPE}
        variables={{
          name,
          category,
          description,
          instructions,
          username
        }}
        update={this.updateCache}
        refetchQueries={() => [
          { query: GET_USER_RECIPES, variables: { username } }
        ]}
      >
        {(addRecipe, { data, error, loading }) => (
          <div className="App">
            <h2 className="App">Add Recipe</h2>
            <form
              className="form"
              onSubmit={e => this.handleSubmit(e, addRecipe)}
            >
              <input
                type="text"
                name="name"
                placeholder="Recipe Name"
                value={name}
                onChange={this.handleChange}
              />
              <select
                name="category"
                value={category}
                onChange={this.handleChange}
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snack">Snack</option>
              </select>
              <input
                type="text"
                name="description"
                placeholder="Add Description"
                value={description}
                onChange={this.handleChange}
              />
              <textarea
                name="instructions"
                placeholder="Add Instructions"
                rows="10"
                value={instructions}
                onChange={this.handleChange}
              />

              <button
                type="submit"
                className="button-primary"
                disabled={loading || this.validateForm()}
              >
                SUBMIT
              </button>

              {error && <Error error={error} />}
            </form>
          </div>
        )}
      </Mutation>
    )
  }
}

export default withAuth(session => session && session.getCurrentUser)(
  withRouter(AddRecipe)
)
