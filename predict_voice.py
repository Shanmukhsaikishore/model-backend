import sys
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
import librosa

# Load the trained model
model = load_model("C:/Users/Lenovo/Downloads/voice.h5")

# Function to preprocess audio
def preprocess_audio(audio_path, max_length):
    audio, sr = librosa.load(audio_path, sr=None)
    mfccs = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=13)
    mfccs = mfccs.T  # Transpose to get time-major format
    padded_mfccs = pad_sequences([mfccs], maxlen=max_length, dtype='float32', padding='post', truncating='post')
    return padded_mfccs

# Main function
if __name__ == '__main__':
    audio_path = sys.argv[1]  # Audio file path from Node.js
    max_length = int(sys.argv[2])  # Maximum sequence length

    processed_audio = preprocess_audio(audio_path, max_length)
    prediction = model.predict(processed_audio)
    predicted_class = np.argmax(prediction, axis=1)[0]

    # Map prediction to class label
    result = "Fake" if predicted_class == 1 else "Real"
    print(result)  # Send result back to Node.js
