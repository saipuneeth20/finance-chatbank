window.addEventListener("DOMContentLoaded", async () => {
  const accountNumber = localStorage.getItem("accountNumber");
  const userDisplay = document.getElementById("userDisplay");

  if (!accountNumber) {
    userDisplay.textContent = "Welcome, Guest";
    return;
  }

  try {
    const response = await fetch(`http://localhost:5000/api/auth/user/${accountNumber}`);
    const data = await response.json();

    userDisplay.textContent = response.ok && data.name
      ? `Welcome, ${data.name}`
      : "Welcome, Guest";
  } catch (err) {
    console.error("User fetch error:", err);
    userDisplay.textContent = "Welcome, Guest";
  }
});

// === Chatbot Logic ===
const chatbotButton = document.querySelector(".chatbot-button");
const chatbotPopup = document.getElementById("chatbotPopup");
const sendBtn = document.getElementById("sendBtn");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");

chatbotButton.addEventListener("click", () => {
  chatbotPopup.classList.toggle("open");
  chatInput.focus();
});

[sendBtn, chatInput].forEach(el =>
  el.addEventListener("click" in el ? "click" : "keypress", (e) => {
    if (e.key === "Enter" || e.type === "click") handleSend();
  })
);

async function handleSend() {
  const message = chatInput.value.trim();
  if (!message) return;

  appendMessage("user", message);
  chatInput.value = "";

  const botReply = generateBotReply(message);
  setTimeout(() => {
    appendMessage("bot", botReply);
    logChatToMongo(message, botReply); // Save conversation
  }, 800);
}

function appendMessage(sender, text) {
  const messageEl = document.createElement("div");
  messageEl.classList.add("chatbot-message", sender);
  messageEl.innerText = text;
  chatMessages.appendChild(messageEl);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateBotReply(message) {
  const msg = message.toLowerCase();

  if (msg.includes("balance")) {
    return "Your current balance is ₹50,000.";
  } else if (msg.includes("transfer")) {
    return "To transfer money, go to the 'New Transaction' section.";
  } else {
    return "I'm here to help! Ask about your balance or how to make a transaction.";
  }
}

// === Store Chat in MongoDB ===
async function logChatToMongo(userMessage, botResponse) {
  const accountNumber = localStorage.getItem("accountNumber");
  if (!accountNumber) return;

  try {
    await fetch("http://localhost:5000/api/chat/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accountNumber, userMessage, botResponse })
    });
  } catch (err) {
    console.error("Chat logging failed:", err);
  }
}
// === Fetch User Data for Chatbot ===
