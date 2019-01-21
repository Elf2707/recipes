import React from 'react'
import ReactDOM from 'react-dom'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom'

import './index.css'
import App from './components/App'
import Navbar from './components/Navbar'
import Search from './components/Recipe/Search'
import RecipePage from './components/Recipe/RecipePage'
import Profile from './components/Profile'
import AddRecipe from './components/Recipe/AddRecipe'
import Signin from './components/Auth/Signin'
import Signup from './components/Auth/Signup'
import withSession from './components/withSession'

const client = new ApolloClient({
  uri: 'http://localhost:4444/graphql',
  fetchOptions: {
    credentials: 'include'
  },
  request: operation => {
    const token = localStorage.getItem('token')
    operation.setContext({ headers: { authorization: token } })
  },
  onError: ({ networkError }) => {
    if (networkError) {
      console.log('Network Error', networkError)
    }
  }
})

const Root = ({ refetch, session }) => (
  <Router>
    <>
      <Navbar session={session} />
      <Switch>
        <Route path="/" exact component={App} />
        <Route path="/search" component={Search} />
        <Route path="/signin" render={() => <Signin refetch={refetch} />} />
        <Route path="/signup" render={() => <Signup refetch={refetch} />} />
        <Route
          path="/recipe/add"
          render={() => <AddRecipe session={session} />}
        />
        <Route path="/recipe/:_id" component={RecipePage} />
        <Route path="/profile" component={Profile} />
        <Redirect to="/" />
      </Switch>
    </>
  </Router>
)

const RootWithSession = withSession(Root)

ReactDOM.render(
  <ApolloProvider client={client}>
    <RootWithSession />
  </ApolloProvider>,
  document.getElementById('root')
)
