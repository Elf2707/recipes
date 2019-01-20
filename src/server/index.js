const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const jwt = require('jsonwebtoken')

require('dotenv').config({ path: 'variables.env' })

const Recipe = require('./models/Recipe')
const User = require('./models/User')

const { graphiqlExpress, graphqlExpress } = require('apollo-server-express')
const { makeExecutableSchema } = require('graphql-tools')

const { typeDefs } = require('./api/schema')
const { resolvers } = require('./api/resolvers')

const graphqlSchema = makeExecutableSchema({
  typeDefs,
  resolvers
})

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to Db'))
  .catch(err => console.log(err))

const app = express()

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true
  })
)

// Set up JWT authentication
app.use(async (req, res, next) => {
  const token = req.headers['authorization']

  if (token !== 'null') {
    try {
      const currentUser = await jwt.verify(token, process.env.SECRET)
      req.currentUser = currentUser
    } catch (err) {
      console.log(err)
    }
  }

  next()
})

app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))
app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress(({ currentUser }) => ({
    schema: graphqlSchema,
    context: {
      Recipe,
      User,
      currentUser
    }
  }))
)

const PORT = process.env.PORT || 4444

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
