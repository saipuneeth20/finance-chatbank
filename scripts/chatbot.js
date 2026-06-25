console.log("✅ chatbot.js loaded");

const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");

// Get the logged-in user's account number from localStorage (you can store it after login)
const accountNumber = localStorage.getItem("accountNumber") || "1234567890";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

function appendMessage(sender, text) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("chatbot-message", sender);
  messageDiv.textContent = text;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function getUserData(accountNumber, endpoint) {
  try {
    const res = await fetch(`/getUser/${accountNumber}`);
    const data = await res.json();
    console.log("✅ User Data:", data);

    if (endpoint === "balance") {
      return `Your current balance is ₹${data.balance}.`;
    }

    if (endpoint === "accountNumber") {
      const masked = "XXXXXX" + data.accountNumber.slice(-4);
      return `Your account number is ${masked}.`;
    }

    return "Requested info not available.";
  } catch (err) {
    console.error("❌ Error fetching user data:", err);
    return "Couldn't fetch account info right now.";
  }
}

async function askDeepSeekAI(userInput) {
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost",
        "X-Title": "BankingChat"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-0528:free",
        messages: [
          {
            role: "system",
            content: "You are a banking assistant. Only answer banking-related questions like balance, transfers, interest rates, cards, etc. Reply in 1–3 lines. Reject unrelated topics politely."
          },
          {
            role: "user",
            content: userInput
          }
        ]
      })
    });

    const data = await res.json();
    console.log("✅ DeepSeek Response:", data);
    return data.choices?.[0]?.message?.content || "No reply from AI.";
  } catch (err) {
    console.error("❌ AI error:", err);
    return "AI is currently unavailable.";
  }
}

async function handleUserMessage() {
  const userInput = chatInput.value.trim();
  if (!userInput) return;

  appendMessage("user", userInput);
  chatInput.value = "";

  const msg = userInput.toLowerCase();
  let botReply = "";

  if (msg.includes("balance")) {
    botReply = await getUserData(accountNumber, "balance");
  } else if (msg.includes("account number") || msg.includes("acc number")) {
    botReply = await getUserData(accountNumber, "accountNumber");
  } else {
    botReply = await askDeepSeekAI(userInput);
  }

  appendMessage("bot", botReply);
}

// Event listeners
sendBtn.addEventListener("click", handleUserMessage);
chatInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleUserMessage();
  }
});
