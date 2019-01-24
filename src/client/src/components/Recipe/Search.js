import React from 'react'
import { ApolloConsumer } from 'react-apollo'
import { Link } from 'react-router-dom'

import { SEARCH_RECIPES } from '../../queries'
import SearchItem from './SearchItem'

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
                  <SearchItem key={recipe._id} recipe={recipe} />
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
