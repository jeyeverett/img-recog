import React from 'react';
import './Profile.css';

const Profile = ({ isProfileOpen, toggleModal }) => {
  return (
    <div className="profile-modal">
      <button className="exit-profile" onClick={() => toggleModal()}>
        EXIT
      </button>
    </div>
  );
};

export default Profile;
