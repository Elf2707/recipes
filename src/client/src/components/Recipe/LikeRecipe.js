import React, { Component } from 'react'
import { Mutation } from 'react-apollo'

import withSession from '../withSession'
import { LIKE_RECIPE, GET_RECIPE, UNLIKE_RECIPE } from '../../queries'

class LikeRecipe extends Component {
  state = {
    liked: false,
    username: ''
  }

  componentDidMount() {
    const { session, _id } = this.props

    if (session.getCurrentUser) {
      const { username, favorites } = session.getCurrentUser
      this.setState({ username, liked: favorites.some(r => r._id === _id) })
    }
  }

  updateLike = (cache, { data: { likeRecipe } }) => {
    const { _id } = this.props
    const { getRecipe } = cache.readQuery({
      query: GET_RECIPE,
      variables: { _id }
    })

    cache.writeQuery({
      query: GET_RECIPE,
      variables: { _id },
      data: {
        getRecipe: { ...getRecipe, likes: likeRecipe.likes + 1 }
      }
    })
  }

  updateUnlike = (cache, { data: { unlikeRecipe } }) => {
    const { _id } = this.props
    const { getRecipe } = cache.readQuery({
      query: GET_RECIPE,
      variables: { _id }
    })

    cache.writeQuery({
      query: GET_RECIPE,
      variables: { _id },
      data: {
        getRecipe: { ...getRecipe, likes: unlikeRecipe.likes - 1 }
      }
    })
  }

  handleClick = (likeRecipe, unlikeRecipe) => {
    this.setState(
      prevState => ({
        liked: !prevState.liked
      }),
      () => this.handleLike(likeRecipe, unlikeRecipe)
    )
  }

  handleLike = (likeRecipe, unlikeRecipe) => {
    if (this.state.liked) {
      likeRecipe().then(async () => await this.props.refetch())
    } else {
      unlikeRecipe().then(async () => await this.props.refetch())
    }
  }

  render() {
    const { _id } = this.props
    const { liked, username } = this.state

    return (
      <Mutation
        mutation={UNLIKE_RECIPE}
        variables={{ _id, username }}
        update={this.updateUnlike}
      >
        {unlikeRecipe => (
          <Mutation
            mutation={LIKE_RECIPE}
            variables={{ _id, username }}
            update={this.updateLike}
          >
            {likeRecipe =>
              username && (
                <button
                  onClick={() => this.handleClick(likeRecipe, unlikeRecipe)}
                >
                  {liked ? 'Unlike' : 'Like'}
                </button>
              )
            }
          </Mutation>
        )}
      </Mutation>
    )
  }
}

export default withSession(LikeRecipe)
