import React from 'react';
import './Profile.css';

const Profile = ({ isProfileOpen, toggleModal, user }) => {
  return (
    <div className="profile-modal">
      <article className="br2 ba b--black-20 mv4 w-100 w-50-m w-25-l mw6 center bg-light shadow-5 h-5">
        <main className="pa4 black-80 w-80 relative">
          <button className="exit-profile f2" onClick={toggleModal}>
            &times;
          </button>
          <img
            src="http://tachyons.io/img/logo.jpg"
            className="br-100 h3 w3 dib mr3"
            alt="avatar"
          />
          <h1 className="f2 mv0 dib">{user.name}</h1>
          <h4 className="f4 mt4">Images submitted: {user.entries}</h4>
          <p className="f6">
            Member since: {new Date(user.joined).toLocaleDateString()}
          </p>
          <hr />
          <label className="mt2 fw6" htmlFor="username">
            Name
          </label>
          <input
            className="pa2 ba w-100 f6"
            type="text"
            name="username"
            id="name"
            style={{ outline: 'none' }}
            value={user.name}
          />
          <label className="mt2 fw6" htmlFor="bio">
            Bio
          </label>
          <textarea
            className="pa2 ba w-100 h4 f6"
            type="text"
            name="bio"
            id="bio"
            placeholder={user.bio || 'Write your bio here...'}
            style={{ outline: 'none', resize: 'none' }}
          />
          <div className="flex justify-center">
            <button
              className="br2 b--dark ph3 pv1 fw6 shadow-5 grow"
              style={{
                backgroundColor: 'rgba(255,255,255,.5)',
              }}
            >
              Save
            </button>
          </div>
        </main>
      </article>
    </div>
  );
};

export default Profile;