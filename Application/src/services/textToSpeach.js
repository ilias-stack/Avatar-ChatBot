function speakText(textToSpeak) {
    const speechSynthesis = window.speechSynthesis;
  
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = "en-US";
    utterance.pitch = 2;    
    utterance.rate = 1;     
    utterance.volume = 1;   
  
    // Ensure voices are loaded before selecting one
    function setVoice() {
      const voices = speechSynthesis.getVoices();
  
      if (voices.length === 0) {
        speechSynthesis.onvoiceschanged = () => setVoice();
        return;
      }
  
      const selectedVoice = voices.find(voice => voice.name.includes("Google US English"));
      utterance.voice = selectedVoice || voices[0];
  
      speechSynthesis.speak(utterance);
    }
  
    setVoice();  
  }
  
  export { speakText };
  