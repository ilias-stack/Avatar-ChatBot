import * as Vosk from 'vosk-browser'
let recognizer = null;
let audioContext = null;
let mediaStream = null;
let processorNode = null;

const messageInput = document.querySelector("#message-input");

async function init() {
    try {
        const model = await Vosk.createModel("../../assets/vosk-model-small-en-us-0.15.tar.gz");

        // Initialize the recognizer with the correct sample rate (16000)
        recognizer = new model.KaldiRecognizer(16000); 

        recognizer.on("result", (message) => {
            messageInput.value=`${message.result.text}`;
        });

    } catch (error) {
        console.error("Error during initialization:", error);
    }
}

async function startRecording() {
    try {
        // Access user's microphone
        mediaStream = await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                channelCount: 1,
                sampleRate: 16000,  // This must match the recognizer's sample rate
            },
        });

        // Create an audio context for processing the microphone input
        audioContext = new AudioContext();

        processorNode = audioContext.createScriptProcessor(4096, 1, 1);  // Process 4096 samples per chunk

        processorNode.onaudioprocess = (event) => {
            try {
                // Directly pass the entire inputBuffer to the recognizer
                if (recognizer.acceptWaveform(event.inputBuffer)) {
                    const result = recognizer.result();
                    console.log("Recognized text:", result.text);
                }
            } catch (error) {
                console.error('Error processing audio:', error);
            }
        };

        // Connect the microphone to the processor node
        const source = audioContext.createMediaStreamSource(mediaStream);
        source.connect(processorNode);
        processorNode.connect(audioContext.destination);  // This sends processed audio to speakers

    } catch (error) {
        console.error("Error starting recording:", error);
    }
}

function stopRecording() {
    try {
        if (processorNode) {
            processorNode.disconnect();
        }

        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
        }

        if (audioContext) {
            audioContext.close();
        }
    } catch (error) {
        console.error("Error stopping recording:", error);
    }
}

export { init, startRecording, stopRecording };
