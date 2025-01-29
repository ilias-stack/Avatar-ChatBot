import google.generativeai as genai
from google.generativeai import GenerativeModel

class EmotionBot:
    def __init__(self, model_name: str):
        with open('api_key.txt', 'r') as file:
            self.api_key = file.read().strip()

        if not self.api_key:
            raise Exception('Empty API key')

        self.model_name = model_name
        self.model = self._initialize_model()

    def _initialize_model(self) -> GenerativeModel:
        """Initialize the generative AI model with the provided API key."""
        genai.configure(api_key=self.api_key)
        return genai.GenerativeModel(self.model_name)

    def prompt_model(self, user_prompt: str) -> str:
        responses = {
            'angry': {
                'response': "I understand you're upset. Let's work through it together.",
                'expression': "cute"
            },
            'disgust': {
                'response': "I see this bothers you. Want to talk about it?",
                'expression': "neutral"
            },
            'fear': {
                'response': "It's okay to feel scared. I'm here to support you.",
                'expression': "reassuring"
            },
            'happy': {
                'response': "That's great to hear! Keep smiling!",
                'expression': "happy"
            },
            'neutral': {
                'response': "I'm here if you need anything.",
                'expression': "friendly"
            },
            'sad': {
                'response': "I'm sorry you're feeling this way. I'm here for you.",
                'expression': "empathetic"
            },
            'surprise': {
                'response': "Wow! That sounds unexpected. Tell me more!",
                'expression': "curious"
            }
        }

        system_message = f'''
        You are an empathetic alien assistant designed to respond appropriately based on the user's emotional state. The responses must be short and have no emojis.
        The user's input will always start with an emotion indicator (e.g., "sad: question", "happy: question", etc.).
        Your tasks are as follows:

        1. Recognize the emotion from the prefix in the user's input. Use this mapping to understand the emotions and their corresponding message tone here's a quick guide for examples: {responses}.
        2. Respond in the following format: "<emotion_category>: <response>". 
        - The `<emotion_category>` is the emotion's tone or expression (e.g., "empathetic", "happy", "reassuring").
        - The `<response>` is the content of the reply, matching the user's emotion in tone and style.

        For example:
        - If the input is "sad: I'm not feeling great today," your reply should be "empathetic: I'm sorry you're feeling this way. I'm here for you."
        - If the input is "happy: I had an amazing day!" your reply should be "happy: That's great to hear! Keep smiling!"

        Always ensure your responses are emotionally aligned, empathetic, and concise. If no emotion is specified, respond in a friendly tone.
        The prompt of the user is:
        '''

        # Generate response using the system message and user prompt
        response = self.model.generate_content(
            f"{system_message}\n{user_prompt}"
            
        ).text

        return response