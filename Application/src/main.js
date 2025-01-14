import "./style.css";
import { animate } from "./threejs/renderer";
import { setupEmotionDetectionService } from "./services/emotionDetection";
import { sendMessageToBot, sendClick } from "./services/askBot";
import { init, startRecording, stopRecording } from "./services/speachToText";
import { speakText } from "./services/textToSpeach";

animate();
// setupEmotionDetectionService(1); // Unit in seconds of how

// Handle message sending
document.querySelector("#send-button").addEventListener("click", async () => {
  await sendClick();
});

// Initialize Vosk and set up the recognizer
let isRecording = false;
const voiceButton = document.querySelector(".voice-icon");
await init();

voiceButton.addEventListener("click", async () => {
  if (isRecording) {
    stopRecording();
    voiceButton.textContent = "🎤"; // Return the original state of button
  } else {
    try {
      await startRecording(); // Start the recording asynchronously
      voiceButton.textContent = "⏹️"; // Update button to indicate recording state
    } catch (error) {
      console.error("Error starting recognition:", error);
    }
  }
  isRecording = !isRecording; // Toggle the recording state
});

// Set the first phrase the AI says at each new load
// window.onload = speakText(
//   "Greetings, Earthling! I am your friendly alien companion, ready to answer all of your questions!"
// );
