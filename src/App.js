import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

const app = new Clarifai.App({
  apiKey: process.env.REACT_APP_CLARIFAI_API
 });

const particlesOptions = {
  particles: {
    number: {
      value: 400,
      density: {
        enable: true,
        value_area: 2000
      }
    }
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageURL: '',
      faceBox: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  // We used this block to test the initial connection between frontend and backend
  // componentDidMount() {
  //   fetch('http://localhost:8080')
  //     .then(res => res.json())
  //     .then(console.log);
  // }
  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    });
  }

  calcFaceBox = ({bottom_row, left_col, right_col, top_row}) => {
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      topRow: top_row * height,
      rightCol: width - (right_col * width),
      bottomRow: height - (bottom_row * height),
      leftCol: left_col * width
    }
  }

  displayFaceBox = (calcBox) => {
    this.setState({faceBox: calcBox});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onDetectImage = () => {
    this.setState({imageURL: this.state.input})
    //Note that below we use this.state.input instead of this.state.imageURL because setState is asynchronous and therefore there is a delay when updating state (input was updated in a separate function so it is ok)
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then(response => {
        if (response) {
          fetch('http://localhost:8080/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: this.state.user.id
            })
          })
          .then(res => res.json())
          .then(count => {
            //Below we use 'Object.assign' to update just the entries field of the user (if we just did { user: { entries: count }} we would overwrite the entire object
            this.setState(Object.assign(this.state.user, { entries: count }))
          })
      }
        this.displayFaceBox(this.calcFaceBox(response.outputs[0].data.regions[0].region_info.bounding_box));
      })
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false, route: 'home'});
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
    const {isSignedIn, imageURL, faceBox, route} = this.state;
    return (
      <div className="App">
        <Particles params={particlesOptions} className='particles' />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { route === 'home' ?
          <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries} />
            <ImageLinkForm onInputChange={this.onInputChange} onDetectImage={this.onDetectImage} />
            <FaceRecognition imageURL={imageURL} faceBox={faceBox} />
          </div>
          : route === 'signin' ?
            <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser} /> 
          : 
            <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
        }
      </div>
    );
  }
}

export default App;
