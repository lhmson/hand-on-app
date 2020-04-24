import React from 'react';
// import {Howl} from 'howler';
// import * as mobilenet from '@tensorflow-models/mobilenet';
// import * as knnClassifier from '@tensorflow-models/knn-classifier';
import './App.css';
// import soundURL from './assets/noti_out.mp3';

// var sound = new Howl({
//   src: [soundURL]
// });
// sound.play();

function App() {
  return (
    <div className="main">
      <h1>HELLO TO MY APP</h1>
      <video
        className="video"
        autoPlay
      />
      <div className="control">
        <button className="btn">Train 1</button>
        <button className="btn">Train 2</button>
        <button className="btn">Start</button>
      </div>
    </div>
  );
}

export default App;
