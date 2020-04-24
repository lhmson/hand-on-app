import React from 'react';
import './App.css';

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
