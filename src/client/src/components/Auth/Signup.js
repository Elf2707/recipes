import React from 'react'
import { Mutation } from 'react-apollo'
import { withRouter } from 'react-router-dom'

import { SIGNUP_USER } from '../../queries'
import Error from '../Error'

const initState = {
  username: '',
  email: '',
  password: '',
  passwordConfirmation: ''
}

class Signup extends React.Component {
  state = { ...initState }

  validateForm() {
    const { username, email, password, passwordConfirmation } = this.state
    return !username || !email || !password || password !== passwordConfirmation
  }

  handleInputChanges = e => {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }

  handleSubmit = (e, signupUser) => {
    e.preventDefault()
    signupUser().then(async ({ data }) => {
      localStorage.setItem('token', data.signupUser.token)
      this.setState({ ...initState })
      await this.props.refetch()
      this.props.history.push('/')
    })
  }

  render() {
    const { username, email, password, passwordConfirmation } = this.state

    return (
      <div className="App">
        <h2 className="App">Sign Up</h2>
        <Mutation
          mutation={SIGNUP_USER}
          variables={{ username, email, password }}
        >
          {(signupUser, { data, loading, error }) => (
            <form
              className="form"
              onSubmit={e => this.handleSubmit(e, signupUser)}
            >
              <input
                type="text"
                name="username"
                placeholder="User Name"
                onChange={this.handleInputChanges}
                value={username}
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                onChange={this.handleInputChanges}
                value={email}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={this.handleInputChanges}
                value={password}
              />
              <input
                type="password"
                name="passwordConfirmation"
                placeholder="Confirm Password"
                onChange={this.handleInputChanges}
                value={passwordConfirmation}
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

export default withRouter(Signup)
