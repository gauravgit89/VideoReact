import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Component } from 'react';

class App extends Component{
  constructor(props){
    super(props);

    this.localVideoref = React.createRef("");
    this.remoteVideoref = React.createRef("");
  }

  componentDidMount(){
    const pc_config = null;

    // const pc_config = {
    //   "iceServers" : [
    //     {
    //       urls: 'stun: [STUN-IP]: [PORT]',
    //       'credential':'[YOUR-CREDENTIAL]',
    //       'userName': '[USERNAME]'
    //     }
    //   ]
    // }

    this.pc = new RTCPeerConnection(pc_config);


    this.pc.onicecandidate = (e) => {
      if (e.candidate)
        console.log(JSON.stringify(e.candidate))
    }

    this.pc.oniceconnectionstatechange = (e) => {
      console.log(e)
    }

    this.pc.ontrack = (e) => {
      console.log("track");
      this.remoteVideoref.current.srcObject = e.streams[0]
    }

    const constraints = {video: true, audio: false};

    const success = (stream) => {
      window.localStream = stream
      this.localVideoref.current.srcObject = stream;
      this.pc.addStream(stream)
    }

    const failure = (e) =>{
      console.log("getUserMedia error", e);
    }

    navigator.mediaDevices.getUserMedia(constraints).then(success).catch(failure);
  }

  createOffer = () => {
    console.log('Offer')

    this.pc.createOffer({ offerToReceiveVideo: 1 })
      .then(sdp => {
        console.log(JSON.stringify(sdp))

        this.pc.setLocalDescription(sdp)
    })
  }

  setRemoteDescription = () =>{
    console.log("setting remote description");
    const desc = JSON.parse(this.textarearef.value);
    this.pc.setRemoteDescription(new RTCSessionDescription(desc));
  }

  createAnswer = () => {
    console.log("Answer");
    // this.pc.createAnswer({offerToReceiveVideo: 1, offerToReceiveAudio: 1}).then(sdp => {
    this.pc.createAnswer({offerToReceiveVideo: 1}).then(sdp => {
      console.log(JSON.stringify(sdp));
      this.pc.setLocalDescription(sdp);
    })
  }

  addCandidate = () => {
    const candidate = JSON.parse(this.textarearef.value);
    console.log("Adding candidate : " , candidate);

    this.pc.addIceCandidate(new RTCIceCandidate(candidate));
  }

render(){

  return (
    <div>
      <video style={{width:240, height:240, margin: 5, backgroundColor: "black"}} ref = {this.localVideoref} autoPlay></video>
      <video style={{width:240, height:240, margin: 5, backgroundColor: "black"}} ref = {this.remoteVideoref} autoPlay></video>
      <br/>
      <button onClick={this.createOffer}>Offer</button>
      <button onClick={this.createAnswer}>Answer</button>
      <br/>
      <textarea ref={ref => {this.textarearef = ref}}/>
      <br/>
      <button onClick = {this.setRemoteDescription}>Set Remote Description</button>
      <button onClick = {this.addCandidate}>Add Candidate</button>
    </div>
  )
}

}



// function App() {
//   return (
//     <div>
//       <video></video>
//     </div>
//   );
// }

export default App;
