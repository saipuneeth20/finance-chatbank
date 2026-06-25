// signup.js
function SamePass() {
  const password = document.getElementById("password").value;
  const rePassword = document.getElementById("re-password").value;

  if (password !== rePassword) {
    alert("Passwords do not match");
    return false;
  }
  return true;
}

async function handleSubmit(event) {
  event.preventDefault();

  if (!SamePass()) return false;
  if (!document.getElementById("agree").checked) {
    alert("Please agree to the terms and conditions");
    return false;
  }

  const name = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();

    if (response.ok) {
      alert("Signup successful!\nAccount No: " + data.user.accountNumber);
      window.location.href = "login.html";

    } else {
      alert("Error: " + data.message);
    }
  } catch (error) {
    alert("Network error: Could not connect to server.");
    console.error(error);
  }
}

// Attach the handler to your form submit event
document.getElementById("signup-form").addEventListener("submit", handleSubmit);
// This function handles the signup form submission, validates the input, and sends a POST request to the server.
// It checks if the passwords match and if the user agrees to the terms before proceeding.