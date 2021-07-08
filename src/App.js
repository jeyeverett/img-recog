import React, { Component } from 'react';
import './App.css';

import Navigation from './components/Navigation/Navigation';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Modal from './components/Modal/Modal';
import Profile from './components/Profile/Profile';
import Particles from 'react-particles-js';

const particlesOptions = {
  particles: {
    number: {
      value: 400,
      density: {
        enable: true,
        value_area: 2000,
      },
    },
  },
};

const initialState = {
  input: '',
  imageURL: '',
  faceBoxes: [],
  route: 'signin',
  isSignedIn: false,
  isProfileOpen: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: '',
  },
};
class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
      },
    });
  };

  processFaceDetection = (boxRegions) => {
    for (let region of boxRegions) {
      const { bounding_box } = region.region_info;
      this.displayFaceBox(this.calcFaceBox(bounding_box));
    }
  };

  displayFaceBox = (calcBox) => {
    this.setState((state, props) => ({
      faceBoxes: [...state.faceBoxes, { ...calcBox }],
    }));
  };
  // {bottom_row, left_col, right_col, top_row}
  calcFaceBox = ({ bottom_row, left_col, right_col, top_row }) => {
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      topRow: top_row * height,
      rightCol: width - right_col * width,
      bottomRow: height - bottom_row * height,
      leftCol: left_col * width,
    };
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onDetectImage = () => {
    this.setState({ imageURL: this.state.input, faceBoxes: [] });
    //Note that below we use this.state.input instead of this.state.imageURL because setState is asynchronous and therefore there is a delay when updating state (input was updated in a separate function so it is ok)
    fetch('http://localhost:8080/imageurl', {
      //send the image url to the backend for API processing
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: this.state.input,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response) {
          //If there is a response increment the entries field on the backend
          fetch('http://localhost:8080/image', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: this.state.user.id,
            }),
          })
            .then((res) => res.json())
            .then((count) => {
              //If backend successfully updates, increment the entries field on the front end
              //Below we use 'Object.assign' to update just the entries field of the user (if we just did { user: { entries: count }} we would overwrite the entire object
              this.setState(Object.assign(this.state.user, { entries: count }));
            })
            .catch((err) => console.log(err));
          this.processFaceDetection(response.outputs[0].data.regions);
        }
      })
      .catch((err) => console.log(err));
  };

  onRouteChange = (route) => {
    if (route === 'signout') {
      return this.setState(initialState);
    } else if (route === 'home') {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  toggleModal = () => {
    this.setState((state) => ({
      ...state,
      isProfileOpen: !state.isProfileOpen,
    }));
  };

  render() {
    const { isSignedIn, imageURL, faceBoxes, route, isProfileOpen } =
      this.state;
    return (
      <div className="App">
        <Particles params={particlesOptions} className="particles" />
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
          toggleModal={this.toggleModal}
        />
        {isProfileOpen && (
          <Modal>
            <Profile
              isProfileOpen={isProfileOpen}
              toggleModal={this.toggleModal}
            />
          </Modal>
        )}
        {route === 'home' ? (
          <div>
            <Logo />
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <FaceRecognition imageURL={imageURL} faceBoxes={faceBoxes} />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onDetectImage={this.onDetectImage}
            />
          </div>
        ) : route === 'signin' ? (
          <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
        ) : (
          <Register
            onRouteChange={this.onRouteChange}
            loadUser={this.loadUser}
          />
        )}
      </div>
    );
  }
}

export default App;
