// Função para registrar um usuário
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

// Função para fazer login
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

// Função para carregar os livros
async function getBooks() {
  try {
    const response = await fetch("http://localhost:3001/books");
    if (!response.ok) {
      throw new Error("Erro ao carregar os livros");
    }
    const books = await response.json();
    const bookList = document.getElementById("book-list");
    bookList.innerHTML = "";

    books.forEach((book) => {
      const li = document.createElement("li");
      li.textContent = `${book.title} - ${book.author}`;

      // Botão para excluir o livro
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Excluir";
      deleteButton.className = "delete-button";
      deleteButton.onclick = () => deleteBook(book.id);

      // Adiciona o botão ao item da lista
      li.appendChild(deleteButton);

      // Adiciona o item à lista
      bookList.appendChild(li);
    });
  } catch (error) {
    console.error("Erro ao carregar os livros:", error);
    alert("Erro ao carregar os livros!");
  }
}

// Função para adicionar um livro
async function addBook() {
  const title = document.getElementById("bookTitle").value;
  const author = document.getElementById("bookAuthor").value;

  await fetch("http://localhost:3001/books", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, author }),
  });

  alert("Livro adicionado!");
  getBooks();
}

// Função para excluir um livro
async function deleteBook(id) {
  try {
    const response = await fetch(`http://localhost:3001/books/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      alert("Livro excluído com sucesso!");
      getBooks(); // Atualiza a lista de livros
    } else {
      const errorData = await response.json();
      alert("Erro ao excluir o livro: " + (errorData.message || "Erro desconhecido"));
    }
  } catch (error) {
    console.error("Erro ao excluir o livro:", error);
    alert("Erro ao excluir o livro!");
  }
}