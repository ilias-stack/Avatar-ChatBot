import axios from "axios";
import { EMOTIONALSTATE } from "./emotionDetection";
import { speakText } from "./textToSpeach";


async function sendMessageToBot(question) {
  try {
    // Send a POST request to the bot API
    const response = await axios.post("http://localhost:5000/ask_bot", {
      query: `${EMOTIONALSTATE}: ${question}`,
    });

    // Return the bot's response
    return response.data.response;
  } catch (error) {
    console.error("Error sending message to bot:", error);
    throw new Error("Failed to communicate with the bot.");
  }
}

// Handle the click function
const sendButton = document.querySelector("#send-button");
const messageInput = document.querySelector("#message-input");
async function sendClick(){
  const userMessage = messageInput.value.trim();
  if (!userMessage) {
    return;
  }
  sendButton.disabled = true;
  sendButton.innerHTML = "Loading...";

  try {
    // Send the message to the bot API and get the response
    const botResponse = await sendMessageToBot(userMessage);
    const splitIndex = botResponse.indexOf(":"); // Occurence of the delimiter between emotion and responseText
    console.log(botResponse)
    if (splitIndex !== -1) {
      const part1 = botResponse.slice(0, splitIndex);
      const part2 = botResponse.slice(splitIndex + 1);
      if (part2) speakText(part2);
      console.log(part1);
    }
    messageInput.value = "";
  } catch (error) {
    console.error("Failed to get a response from the bot.",error);
  } finally {
    sendButton.disabled = false;
    sendButton.innerHTML = "Send";
  }
}

export {sendMessageToBot, sendClick}
