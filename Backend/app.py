import cv2
import numpy as np
from flask import Flask, request, jsonify
from keras.models import model_from_json
import base64
from flask_cors import CORS
from io import BytesIO
from PIL import Image
from chatbot.llm_service import EmotionBot

# Initialise the emotion detection module
json_file = open("emotion detection/emotiondetector.json", "r")
model_json = json_file.read()
json_file.close()
model = model_from_json(model_json)
model.load_weights("emotion detection/emotiondetector.h5")

# Loading face recognition module to opencv
haar_file = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
face_cascade = cv2.CascadeClassifier(haar_file)

labels = {0: 'angry', 1: 'disgust', 2: 'fear', 3: 'happy', 4: 'neutral', 5: 'sad', 6: 'surprise'}

# Reshaping and normalising the data to match the train
def extract_features(image):
    feature = np.array(image)
    feature = feature.reshape(1, 48, 48, 1)
    return feature / 255.0

# Initialise the llm bot module
emotion_bot=EmotionBot('gemini-pro')    

app = Flask(__name__)
CORS(app, resources={r"*": {"origins": "*"}})

@app.route('/predict_emotion', methods=['POST'])
def predict_emotion():
    try:
        img_data = request.json['image']
        
        # Convert base64 image into normal image
        img_data = base64.b64decode(img_data)
        image = Image.open(BytesIO(img_data))
        image = np.array(image)
        
        # Covert into grayscale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Detect the faces present in the image
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)
        
        predictions = []
        
        # Iterate through every face in the image
        for (p, q, r, s) in faces:
            face_image = gray[q:q + s, p:p + r]
            face_image = cv2.resize(face_image, (48, 48))
            img = extract_features(face_image)
            pred = model.predict(img)
            prediction_label = labels[pred.argmax()]
            predictions.append(prediction_label)

        return jsonify({"predictions": predictions if len(predictions)>=1 else ['unkown']}), 200
    
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 400
    
    
@app.route('/ask_bot', methods=['POST'])
def ask_bot():
    try:
        data = request.get_json()
        
        # Validate request data
        if not data or 'query' not in data:
            return jsonify({
                'error': 'Missing query in request body'
            }), 400
            
        # Get the query from request body
        query = data['query']
        
        # Return the response
        return jsonify({
            'response': emotion_bot.prompt_model(query)
        }), 200
            
    except Exception as e:
        app.logger.error(f"Error processing request: {str(e)}")
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True)
