from flask import Flask, request, jsonify
import requests
import assemblyai as aai

app = Flask(__name__)
aai.settings.api_key = ""
transcriber = aai.Transcriber()

NEXT_JS_API_URL = "http://localhost:3000/api/summarize"

@app.route('/transcribe', methods=['POST'])
def transcribe():
    data = request.json
    audio_url = data['audio_url']
    
    try:
        transcript = transcriber.transcribe(audio_url)
        transcript_text = transcript.text
        
        response = requests.post(NEXT_JS_API_URL, json={"transcript": transcript_text})
        response_data = response.json()

        return jsonify(response_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)
