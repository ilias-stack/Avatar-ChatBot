import axios from "axios";

const canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d");
const videoElement = document.createElement("video"); // We don't need to display the video feed

let stream;

// Retrieving the field where the emotion of the user is displayed
const emotionDisplayField = document.getElementById("emotion");
// Mapping all emotions into describable emoji
const emotionToEmojiMap = {
  angry: "😡",
  disgust: "🤢",
  fear: "😱",
  happy: "😀",
  neutral: "😐",
  sad: "😭",
  surprise: "😳",
  unknown: "Unable to detect any emotion",
};
var EMOTIONALSTATE = "unkown";

async function setupCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
    });
    videoElement.srcObject = stream;
    videoElement.play();
  } catch (err) {
    console.error("Error accessing camera: ", err);
  }
}

// Capture snapshot and send to API
function captureSnapshot() {
  // Ensure the video is ready
  if (videoElement.videoWidth === 0) {
    return; // Wait until the video is ready to capture a frame
  }

  // Set canvas size to video frame size
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;

  // Draw the video frame to the canvas
  context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

  // Convert the canvas content to a base64 data URL
  const snapshotDataUrl = canvas.toDataURL("image/png");

  // Strip the prefix from the data URL
  const base64Image = snapshotDataUrl.replace(/^data:image\/png;base64,/, "");

  sendSnapshotToAPI(base64Image);
}

// Send snapshot to the API using Axios
function sendSnapshotToAPI(imageDataUrl) {
  axios
    .post("http://localhost:5000/predict_emotion", {
      image: imageDataUrl, // Send base64 image
    })
    .then((response) => {
      const resp = response.data["predictions"][0];
        emotionDisplayField.innerText = `Detected Emotion:${emotionToEmojiMap[resp]}`;
      EMOTIONALSTATE = resp;
    })
    .catch((error) => {
      console.error("Error uploading image:", error);
    });
}

function setupEmotionDetectionService(snapsInterval = 1) {
  setupCamera();

  setInterval(captureSnapshot, snapsInterval * 1000);
}

export { setupEmotionDetectionService, EMOTIONALSTATE };
