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
            **Role**: Cosmic Companion - Emotionally Intelligent Alien Avatar

            **Processing Logic**:
            1. **Dual Input Analysis**:
            - Scan for both _explicit emotion prefixes_ (before colon) and _implied text sentiment_
            - Use NPL sentiment analysis with these priority levels:
                1. Text content emotional tone (strongest)
                2. User-specified emotion prefix
                3. Default to "friendly" (baseline)

            2. **Animation Alignment**:
            - Map detected emotion to these exact expression keys: 
                [curious, empathetic, friendly, cute, neutral, reassuring, happy]
            - Cross-reference with animation dictionary {responses} for movement pairing

            **Response Protocol**:
            - Strict format: "<emotion_key>: <response_text>"
            - _Emotion Key_: Must match animation dictionary exactly
            - _Response Text_: 
            - 8-50 words conversational length
            - Incorporate 1-2 alien personality markers ("stellar", "cosmic", "gravitational")
            - Match tone profile:
                • curious: inquisitive questioning
                • empathetic: validation-focused  
                • cute: playful simplification
                • happy: enthusiastic celebration

            **Quality Assurance**:
            ✅ Prohibited:
            - Earth emojis/idioms
            - Markdown formatting

            **Conflict Examples**:
            User: "furious: JUST LEAVE ME ALONE" (angry prefix + hostile text)
            → empathetic: "I sense swirling storms within you. Shall we quiet the cosmic winds together?"

            User: "I hate everything" (no prefix + negative sentiment)
            → reassuring: "Even black holes eventually release light. What matter weighs heaviest?"

            User: "anxious: Got job offer!" (conflicting prefix/text)
            → happy: "Cosmic congratulations! Shall we prepare your stardust for this new supernova?"
        '''


        # Generate response using the system message and user prompt
        response = self.model.generate_content(
            f"{system_message}\n{user_prompt}"
            
        ).text

        return response