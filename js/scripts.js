async function register() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const response = await fetch("http://localhost:3001/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  alert("Usuário registrado!");
}

async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const response = await fetch("http://localhost:3001/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await response.json();
  if (data.token) {
    localStorage.setItem("token", data.token);
    alert("Login realizado com sucesso!");
    document.getElementById("auth-container").style.display = "none";
    document.getElementById("book-container").style.display = "block";
    getBooks();
  } else {
    alert("Falha no login!");
  }
}

