import React, { useEffect, useRef } from 'react';
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

  const video = useRef();
  
  const init = async () => {
    console.log('init');
    await setupCamera();
    console.log("setup camera enter")
  }
  // ask to access user camera
  const setupCamera = () => {
    return new Promise((resolve,reject) => {
      navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;
      
      if(navigator.getUserMedia){
        navigator.getUserMedia(
          { video: true },
          stream => {
            video.current.srcObject = stream;
            video.current.addEventListener('loadeddata', resolve)
          },
          error => reject(error)
        );
      }
      else {
        reject();
      }
    });
  }
  useEffect(() => {
    init();
    console.log("it runs")
    // cleanup
    return () => {

    }
  }, []);
  return (
    <div className="main">
      <h1>HELLO TO MY APP</h1>
      <video
        ref={video}
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
