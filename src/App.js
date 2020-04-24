import React, { useEffect, useRef } from 'react';
// import {Howl} from 'howler';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as knnClassifier from '@tensorflow-models/knn-classifier';
import './App.css';
// import soundURL from './assets/noti_out.mp3';

// var sound = new Howl({
//   src: [soundURL]
// });
// sound.play();

function App() {

  const video = useRef(); // read more about useRef in react
  const mobilenetModule = useRef();
  const classifier = useRef();

  const TRAINING_TIMES = 50;
  const HAND_ON_LABEL = "hand on";
  const HAND_OUT_LABEL = "hand out";
  
  const init = async () => {
    console.log('init');
    await setupCamera();
    console.log("setup camera enter");
    // Load the model
    mobilenetModule.current = await mobilenet.load();
    // Create the classifier
    classifier.current = knnClassifier.create();
    console.log("setup success");
    console.log("Hand out and click train btn");
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
            video.current.addEventListener('loadeddata', resolve) // load resolve
          },
          error => reject(error) // load reject
        );
      }
      else {
        reject();
      }
    });
  }

  const train = async label => {
    console.log(label);
    for(let i=0;i<TRAINING_TIMES;i++){
      console.log(`Loading ${parseInt((i+1)/TRAINING_TIMES*100)}%`);
      await sleep(100);
    }
  }
  // slow down speed of training
  const sleep = ms => {
    return new Promise(resolve => {
      setTimeout(resolve,ms);
    })
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
        <button className="btn" onClick={() => {
          train(HAND_ON_LABEL);
        }}>Train 1</button>
        <button className="btn" onClick={() => {
          train(HAND_OUT_LABEL);
        }}>Train 2</button>
        <button className="btn" onClick={() => {

        }}>Start</button>
      </div>
    </div>
  );
}

export default App;
