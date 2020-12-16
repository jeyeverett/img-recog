import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
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
      route: 'signin'
    }
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
    console.log(this.state.faceBox);
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onDetectImage = () => {
    this.setState({imageURL: this.state.input})
    //Note that below we use this.state.input instead of this.state.imageURL because setState is asynchronous and therefore there is a delay when updating state (input was updated in a separate function so it is ok)
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then(response => {
        console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
        this.displayFaceBox(this.calcFaceBox(response.outputs[0].data.regions[0].region_info.bounding_box));
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="App">
        <Particles params={particlesOptions} className='particles' />
        <Navigation />
        { this.state.route !== 'signin' ?
           <SignIn /> 
          : 
          <div>
            <Logo />
            <Rank />
            <ImageLinkForm onInputChange={this.onInputChange} onDetectImage={this.onDetectImage} />
            <FaceRecognition imageURL={this.state.imageURL} faceBox={this.state.faceBox} />
          </div>
        }
      </div>
    );
  }
}

export default App;
