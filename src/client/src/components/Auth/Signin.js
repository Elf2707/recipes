import React from 'react'

export default class Signin extends React.Component {
  render() {
    return (
      <div className="App">
        <h2 className="App">Sign Up</h2>
        <form className="form">
          <input type="text" name="username" placeholder="User Name" />
          <input type="email" name="email" placeholder="Email Address" />
          <input type="password" name="password" placeholder="Password" />
          <input
            type="password"
            name="passwordConfirmation"
            placeholder="Confirm Password"
          />
          <button type="submit" className="button-primary">
            Submit
          </button>
        </form>
      </div>
    )
  }
}
