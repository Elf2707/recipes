import React from 'react'
import { ApolloConsumer } from 'react-apollo'
import { Link } from 'react-router-dom'

import { SEARCH_RECIPES } from '../../queries'

class Search extends React.Component {
  state = { searchResults: [] }

  handleOnChange = async (e, client) => {
    const { data } = await client.query({
      query: SEARCH_RECIPES,
      variables: { searchTerm: e.target.value }
    })

    this.setState({ searchResults: data.searchRecipes })
  }

  render() {
    const { searchResults } = this.state

    return (
      <ApolloConsumer>
        {client => {
          return (
            <div className="App">
              <input
                type="search"
                placeholder="Search for Recipes"
                onChange={e => this.handleOnChange(e, client)}
              />
              <ul className="search-results">
                {searchResults.map(recipe => (
                  <li key={recipe._id}>
                    <Link to={`/recipe/${recipe._id}`}>
                      <h4>{recipe.name}</h4>
                    </Link>
                    <p>{recipe.likes}</p>
                  </li>
                ))}
              </ul>
            </div>
          )
        }}
      </ApolloConsumer>
    )
  }
}

export default Search
