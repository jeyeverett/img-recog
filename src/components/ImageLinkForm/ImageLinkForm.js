import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = () => {
    return (
        <div>
            <p className='f3'>
                {`Upload an image and behold the power of technology!`}
            </p>
            <div className='w-60 center pa4 shadow-2 form'>
                <input type='text' className='f4 w-80' />
                <button className='w-20 grow f4 link ph3 pv2 dib white bg-blue'>Detect</button>
            </div>
        </div>
    );
}
export default ImageLinkForm;