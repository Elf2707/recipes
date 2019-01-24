import React from 'react'

import UserInfo from './UserInfo'
import UserRecipes from './UserRecipes'
import withAuth from '../withAuth'

const Profile = ({ session }) => {
  const user = session && session.getCurrentUser ? session.getCurrentUser : null

  return (
    <div>
      <UserInfo user={user} />
      <UserRecipes username={user ? user.username : 'Unknown'} />
    </div>
  )
}

export default withAuth(session => session && session.getCurrentUser)(Profile)
