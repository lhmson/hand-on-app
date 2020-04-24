import React, { useEffect, useRef, useState } from 'react';
import {Howl} from 'howler';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as knnClassifier from '@tensorflow-models/knn-classifier';
import { initNotifications, notify } from '@mycv/f8-notification';
import './App.css';
import soundURL from './assets/Beep_Short.mp3';
import signalSoundURL from './assets/Glass_Crunch.mp3';

var sound = new Howl({
  src: [soundURL]
});
var signalSound = new Howl({
  src: [signalSoundURL]
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
    try{
      console.log('init');
      await setupCamera();
      console.log("setup camera enter");
      // Load the model
      mobilenetModule.current = await mobilenet.load();
      // Create the classifier
      classifier.current = knnClassifier.create();
      console.log("setup success");
      console.log("Hand out and click train btn");
      alert("Everything is ready, use the app");
      signalSound.play();
      // display noti
      initNotifications({ cooldown: 3000 });
    } catch {
      alert("There is a problem, refresh the website");
    }
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
    try{
      console.log(label + " learning from video");
      for(let i=0;i<TRAINING_TIMES;i++){
        console.log(`Loading ${parseInt((i+1)/TRAINING_TIMES*100)}%`);
        await trainProgress(label);
      }
      console.log("Training end");
      signalSound.play();
    } catch {
      console.log("Read the instruction clearly, refresh the website");
    }
  }

  // use machine learning to learn image hand
  const trainProgress = label => {
    try {
      return new Promise(async resolve => {
        const embed = mobilenetModule.current.infer(
          video.current, true
        );
        classifier.current.addExample(embed, label);
        await sleep(100);
        resolve();
      })
    } catch {
      console.log("Read the instruction clearly and do it step by step, so refresh to use");
    }
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
        notify('Let your hand out of face immediately', { body: 'Hey, do you know that keyboard contains lots of bacteria and virus, even dirtier than toilet. There is COVID around the world. Keep healthy for self and family' });
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

  const main = (
    <div className={`main ${handon? "handon" : " "}`}>
      <h1>WELCOME TO MY APP</h1>
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
      <div className="ruleSet">
        <h2 className="heading" style={{textAlign: 'center'}}>Read the instruction clearly before using the app</h2>
        <ul className="list">
          <li className="steps">1. Turn on camera</li>
          <li className="steps">2. Turn on notifications</li>
          <li className="steps">3. Wait for the beginning signal</li>
          <li className="steps">4. Put your hand in front of your screen and near the face so that it can be seen at the bottom of the webcam frame</li>
          <li className="steps">5. Click button Train Hands on, now move your hand freely towards the center of your face as long as it appears in the webcam frame, you can use both hands. Remember at least one of your hands appears in the frame. Do it for 10 seconds (until there is a signal on)</li>
          <li className="steps">6. Now put your hands down and click on button Train hands out, then you cannot put your hand so that it stays in the frame for 10 seconds (until a signal is on). Things in background should be the same too</li>
          <li className="steps">7. Click on Run and enjoy the time working on the computer and your hands may not touch your face for clean, leave this page open and go to another window or tab to work</li>
          <li className="steps">8. Enjoy safe COVID outbreak</li>
        </ul>
      </div>
      <div>
        <h3>Lee Sown 2020 - product learned from Internet</h3>
      </div>
    </div>
  );
  
  return main;
}

export default App;
