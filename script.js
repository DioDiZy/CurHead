const API_URL = "https://n8n-cfyemrjgamn4.emas.sumopod.my.id/webhook/5af334c9-d61e-4b51-8ec2-f511922c0f00/chat";

// persistent session ID
let sessionId = localStorage.getItem("chat_session_id");
if (!sessionId) {
  sessionId = crypto.randomUUID();
  localStorage.setItem("chat_session_id", sessionId);
}

const chatMessages = document.getElementById("chatMessages");
const userInput = document.getElementById("userInput");

function addMessage(text, sender) {
  const div = document.createElement("div");
  div.className = `message ${sender}`;
  div.textContent = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, "user");
  userInput.value = "";

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: sessionId,
      chatInput: message,
    }),
  });

  const data = await response.json();

  // const reply = data?.content || data?.reply || data?.message || JSON.stringify(data);
  const result = Array.isArray(data) ? data[0] : data;
  const reply = result?.output || result?.content || result?.reply || result?.message || "Sorry, I couldn't process that.";
  addMessage(reply, "bot");
}

userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});
