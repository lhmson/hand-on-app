import React, { useEffect, useRef, useState } from 'react';
import {Howl} from 'howler';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as knnClassifier from '@tensorflow-models/knn-classifier';
import { initNotifications, notify } from '@mycv/f8-notification';
import './App.css';
import soundURL from './assets/noti_out.mp3';

var sound = new Howl({
  src: [soundURL]
});

function App() {

  const video = useRef(); // read more about useRef in react
  const mobilenetModule = useRef();
  const classifier = useRef();

  const [handon, setHandon] = useState(false);
  const soundHandle = useRef(true);

  const TRAINING_TIMES = 50;
  const HAND_ON_LABEL = "hand on";
  const HAND_OUT_LABEL = "hand out";
  const DETECT_CONFIDENCE = 0.89;
  
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
    // display noti
    initNotifications({ cooldown: 3000 });
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
    console.log(label + " learning from video");
    for(let i=0;i<TRAINING_TIMES;i++){
      console.log(`Loading ${parseInt((i+1)/TRAINING_TIMES*100)}%`);
      await trainProgress(label);
    }
    console.log("Training end")
  }

  // use machine learning to learn image hand
  const trainProgress = label => {
    return new Promise(async resolve => {
      const embed = mobilenetModule.current.infer(
        video.current, true
      );
      classifier.current.addExample(embed, label);
      await sleep(100);
      resolve();
    })
  }

  const run = async () => {
    try{
      const embed = mobilenetModule.current.infer(
      video.current, true
      );
      const result = await classifier.current.predictClass(embed);

      if(result.label === HAND_ON_LABEL && result.confidences[result.label]>DETECT_CONFIDENCE) {
        console.log("Hand on");
        // turn on noti there
        if(soundHandle.current == true){
          soundHandle.current = false;
          sound.play();
        }
        notify('Let your hand out of face immediately', { body: 'Hey, do you know that keyboard contains lots of bacteria and virus, even dirtier than toilet. There is COVID around the world. Keep healthy for yourself and family' });
        setHandon(true);
      }
      else{
        console.log("Hand out");
        setHandon(false);
      }
      // run again in 1 seconds
      await sleep(200);
      run();
    } catch {
      alert("Data has not been entered through image hand training")
    }
  }

  // slow down speed of training
  const sleep = (ms = 0) => {
    return new Promise(resolve => {
      setTimeout(resolve,ms);
    })
  }

  useEffect(() => {
    init();
    console.log("it runs")

    // sound handle
    sound.on('end', function(){
      soundHandle.current = true;
    });

    // cleanup
    return () => {

    }
  }, []);
  return (
    <div className={`main ${handon? "handon" : " "}`}>
      <h1>HELLO TO MY APP</h1>
      <video
        ref={video}
        className="video"
        autoPlay
      />
      <div className="control">
        <button className="btn" onClick={() => {
          train(HAND_ON_LABEL);
        }}>Train Hands on</button>
        <button className="btn" onClick={() => {
          train(HAND_OUT_LABEL);
        }}>Train Hands out</button>
        <button className="btn" onClick={() => {
          run();
        }}>Start</button>
      </div>
    </div>
  );
}

export default App;
