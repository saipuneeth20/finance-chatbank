async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      alert("Login successful! Welcome, " + data.user.name);
      localStorage.setItem("user", JSON.stringify(data.user)); // optional
      window.location.href = "home.html"; // change if you use another dashboard page
    } else {
      alert("Error: " + data.message);
    }
  } catch (err) {
    console.error(err);
    alert("Network error: Could not connect to server.");
  }
}
if (response.ok) {
  // Assuming response.json() gives { user: { accountNumber, name, ... } }
  localStorage.setItem("accountNumber", data.user.accountNumber);
  localStorage.setItem("user", JSON.stringify(data.user)); // Optional: full user
  window.location.href = "home.html";
}


// This function handles the login form submission, sends the credentials to the server,
