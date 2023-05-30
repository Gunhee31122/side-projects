'use strict'

const recordBtn = document.querySelector('.record-btn');
const stopBtn = document.querySelector('.stop-btn');
const playBtn = document.querySelector('.play-btn');
const downloadBtn = document.querySelector('.download-btn');
const previewPlayer = document.querySelector('#preview');
const recordingPlayer = document.querySelector('#recording');

let recorder ; // 녹화 정보
let recordedChunks = [];  //녹화중단시 내용이 당김

function videoStart(){
    navigator.mediaDevices.getUserMedia({video:true, audio:true})
    .then(stream => {
        previewPlayer.srcObject = stream; // 실시간 화면을 띄워줌
        startRecording(previewPlayer.captureStream())
    })
}

function startRecording(stream){ // 녹화시작 버튼
    recordedChunks = [];
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (e) => {recordedChunks.push(e.data)};
    recorder.start();
}

function stopRecording() { // 녹화중지 버튼
    previewPlayer.srcObject.getTracks().forEach(track => track.stop());
    recorder.stop()
}

function playRecording() {
    const recordedBlob = new Blob(recordedChunks,{type:'video/webm'}) // 블롭 만듬 , 웹에서 돌아가는 동영상 확장자
    recordingPlayer.src = URL.createObjectURL(recordedBlob);
    recordingPlayer.play();
    downloadBtn.href = recordingPlayer.src;
    downloadBtn.download = `recording_${new Date()}.webm`
}


recordBtn.addEventListener('click',videoStart);
stopBtn.addEventListener('click',stopRecording);
playBtn.addEventListener('click',playRecording);
downloadBtn.addEventListener('click',)