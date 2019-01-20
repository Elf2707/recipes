import React from 'react'
import { Mutation } from 'react-apollo'
import { withRouter } from 'react-router-dom'

import { SIGNIN_USER } from '../../queries'
import Error from '../Error'

const initState = {
  username: '',
  password: ''
}

class Signin extends React.Component {
  state = { ...initState }

  validateForm() {
    const { username, password } = this.state
    return !username || !password
  }

  handleInputChanges = e => {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }

  handleSubmit = (e, signinUser) => {
    e.preventDefault()
    signinUser().then(async ({ data }) => {
      localStorage.setItem('token', data.signinUser.token)
      this.setState({ ...initState })
      await this.props.refetch()
      this.props.history.push('/')
    })
  }

  render() {
    const { username, password } = this.state

    return (
      <div className="App">
        <h2 className="App">Sign In</h2>
        <Mutation mutation={SIGNIN_USER} variables={{ username, password }}>
          {(signinUser, { data, loading, error }) => (
            <form
              className="form"
              onSubmit={e => this.handleSubmit(e, signinUser)}
            >
              <input
                type="text"
                name="username"
                placeholder="User Name"
                onChange={this.handleInputChanges}
                value={username}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={this.handleInputChanges}
                value={password}
              />

              <button
                type="submit"
                className="button-primary"
                disabled={loading || this.validateForm()}
              >
                Submit
              </button>

              {error && <Error error={error} />}
            </form>
          )}
        </Mutation>
      </div>
    )
  }
}

export default withRouter(Signin)
