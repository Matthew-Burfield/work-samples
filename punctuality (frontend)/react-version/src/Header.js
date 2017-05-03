import React from 'react'
import PropTypes from 'prop-types'

const Header = ({ name }) =>
  <div className="header-container">
    <div className="profile">
      <div className="profile-image">
        <img alt="" src="/images/profile.jpg" width="70px" height="70px" />
      </div>
      <div className="profile-name">
        <span>{name}</span>
      </div>
    </div>
  </div>;

Header.propTypes = {
  name: PropTypes.string
}

export default Header