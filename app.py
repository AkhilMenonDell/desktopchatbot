from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import subprocess

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")  # Enable WebSockets

OLLAMA_MODEL = "llama3.2"  # Ensure this model is installed locally

@app.route("/")
def home():
    return render_template("index.html")

@socketio.on("send_message")
def handle_message(data):
    prompt = data.get("prompt", "")
    model = data.get("model", OLLAMA_MODEL)

    if not prompt:
        emit("response", {"error": "Prompt is required"})
        return

    try:
        # Run Ollama locally with UTF-8 encoding
        process = subprocess.run(
            ["ollama", "run", model],
            input=prompt,
            text=True,
            encoding="utf-8",  # Force UTF-8 encoding to prevent decode errors
            capture_output=True
        )

        response_text = process.stdout.strip()
        emit("response", {"response": response_text})

    except Exception as e:
        emit("response", {"error": f"Error running Ollama: {str(e)}"})

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)
