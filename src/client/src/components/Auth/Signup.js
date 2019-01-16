import React from 'react'

export default class Signup extends React.Component {
  state = {
    username: '',
    email: '',
    password: '',
    passwordConfirmation: ''
  }

  handleInputChanges = e => {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }

  render() {
    const { username, email, password, passwordConfirmation } = this.state

    return (
      <div className="App">
        <h2 className="App">Sign Up</h2>
        <form className="form">
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
          <button type="submit" className="button-primary">
            Submit
          </button>
        </form>
      </div>
    )
  }
}
