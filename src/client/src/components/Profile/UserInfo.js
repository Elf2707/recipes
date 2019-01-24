import React from 'react'
import { Link } from 'react-router-dom'

const formatDate = date => {
  const newDate = new Date(date).toLocaleDateString('en-US')
  const newTime = new Date(date).toLocaleDateString('en-US')

  return `${newDate} at ${newTime}`
}

const UserInfo = ({ user }) => {
  if (!user) return null

  return (
    <div className="App">
      <h4>User Info</h4>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
      <p>Join Date: {formatDate(user.joinDate)}</p>

      <ul>
        <h3>{user.username}'s Favorites</h3>
        {user.favorites.map(favorite => (
          <li key={favorite._id}>
            <Link to={`/recipe/${favorite._id}`}>
              <p>{favorite.name}</p>
            </Link>
          </li>
        ))}
        {user.favorites.length === 0 && (
          <p>
            <strong>You have no favorites currently. Go add some!</strong>
          </p>
        )}
      </ul>
    </div>
  )
}

export default UserInfo
