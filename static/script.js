const socket = io();

// Dark mode toggle
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    document.body.classList.toggle("light-mode");
    localStorage.setItem("dark-mode", document.body.classList.contains("dark-mode"));
}

// Load dark mode preference
if (localStorage.getItem("dark-mode") === "true") {
    document.body.classList.add("dark-mode");
} else {
    document.body.classList.add("light-mode");
}

// Handle sending messages
function sendMessage() {
    const inputField = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");
    const userMessage = inputField.value.trim();

    if (!userMessage) return;

    chatBox.innerHTML += `<div class="user-message"><b>You:</b> ${userMessage}</div>`;
    inputField.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;

    socket.emit("send_message", { prompt: userMessage, model: "llama3.2" });
}

// Handle responses
socket.on("response", (data) => {
    const chatBox = document.getElementById("chat-box");
    chatBox.innerHTML += `<div class="bot-message"><b>Ollama:</b> ${data.response}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
});
