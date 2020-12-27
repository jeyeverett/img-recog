import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({imageURL, faceBox}) => {
    return (
        <div className='center ma'>
            <div className='relative mt2'>
                <img id='inputImage' src={imageURL} alt='' />
                <div className='bounding-box' style={{top: faceBox.topRow, right: faceBox.rightCol, bottom: faceBox.bottomRow, left: faceBox.leftCol}}></div>
            </div>
        </div>
    );
}
export default FaceRecognition;